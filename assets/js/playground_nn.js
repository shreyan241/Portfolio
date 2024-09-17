class Neuron {
    constructor(x, y, layerIndex, neuronIndex) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.activation = 0;
        this.layerIndex = layerIndex;
        this.neuronIndex = neuronIndex;
        this.delta = 0; // For backpropagation
        this.hue = 210; // Start with blue hue
    }

    draw(ctx) {
        // Increase brightness and shift color based on activation
        const brightness = 50 + this.activation * 50;
        const alpha = 0.5 + this.activation * 0.5;
        const hueShift = this.hue + this.activation * 60; // Shifts hue with activation

        // Draw neuron with pulsating glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + Math.sin(Date.now() / 500) * 2, 0, Math.PI * 2); // Slight pulsating effect
        ctx.fillStyle = `hsla(${hueShift}, 100%, ${brightness}%, ${alpha})`;
        ctx.shadowBlur = 30 * this.activation; // Enhanced glow
        ctx.shadowColor = `hsla(${hueShift}, 100%, ${brightness}%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}


class Connection {
    constructor(from, to) {
        this.from = from;
        this.to = to;
        this.weight = this.initializeWeight();
    }

    initializeWeight() {
        // Xavier Initialization for better convergence
        const fanIn = 1;
        const fanOut = 1;
        const limit = Math.sqrt(6 / (fanIn + fanOut));
        return Math.random() * 2 * limit - limit;
    }

    draw(ctx) {
        const strength = Math.abs(this.weight)/3;
        const opacity = Math.min(0.2 + 0.8 * strength * this.from.activation * this.to.activation, 1);

        // Laser-like color gradient with more intensity
        const startHue = 220;
        const endHue = 280;

        const gradient = ctx.createLinearGradient(this.from.x, this.from.y, this.to.x, this.to.y);
        gradient.addColorStop(0, `hsla(${startHue}, 100%, 50%, ${opacity})`);
        gradient.addColorStop(1, `hsla(${endHue}, 100%, 50%, ${opacity})`);

        // Dynamic line width based on activation
        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5 + Math.sin(Date.now() / 500) * 0.5 + strength * 1.5; // Slight pulsating width
        ctx.shadowBlur = 15 * strength;
        ctx.shadowColor = `hsla(${endHue}, 100%, 50%, ${opacity})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

class NeuralNetwork {
    constructor(canvas, graphCanvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphCanvas = graphCanvas;
        this.graphCtx = graphCanvas.getContext('2d');

        this.neurons = [];
        this.connections = [];

        this.layers = [1, 6, 6, 6, 1]; // Input, Hidden1, Hidden2, Hidden3, Output
        this.learningRate = 0.3; // Adjusted learning rate for stability
        this.maxEpochs = 1000; // Training for 1000 epochs
        this.currentEpoch = 0;
        this.loss = 0.0;

        this.initializeNetwork();
        this.initializeGraph();
    }

    initializeNetwork() {
        const layerCount = this.layers.length;
        const layerSpacing = this.canvas.width / (layerCount + 1);

        // Initialize neurons
        this.neurons = []; // Reset neurons array
        this.connections = []; // Reset connections array

        this.layers.forEach((layerSize, layerIndex) => {
            const x = layerSpacing * (layerIndex + 1);
            const verticalSpacing = this.canvas.height / (layerSize + 1);
            for (let i = 0; i < layerSize; i++) {
                const y = verticalSpacing * (i + 1);
                const neuron = new Neuron(x, y, layerIndex, i);
                this.neurons.push(neuron);
            }
        });

        // Initialize connections
        const neuronsPerLayer = this.layers;
        let neuronIndex = 0;
        for (let l = 0; l < neuronsPerLayer.length - 1; l++) {
            const currentLayerSize = neuronsPerLayer[l];
            const nextLayerSize = neuronsPerLayer[l + 1];
            for (let i = 0; i < currentLayerSize; i++) {
                for (let j = 0; j < nextLayerSize; j++) {
                    const from = this.neurons[neuronIndex + i];
                    const to = this.neurons[neuronIndex + currentLayerSize + j];
                    const connection = new Connection(from, to);
                    this.connections.push(connection);
                }
            }
            neuronIndex += currentLayerSize;
        }
    }

    initializeGraph() {
        // Clear the graph canvas
        this.graphCtx.fillStyle = '#000814'; // Dark background
        this.graphCtx.fillRect(0, 0, this.graphCanvas.width, this.graphCanvas.height);

        // Draw true function line (y = sin(x))
        this.graphCtx.strokeStyle = '#00ffea'; // Neon cyan
        this.graphCtx.lineWidth = 3; // Increased line width for better visibility
        this.graphCtx.setLineDash([]); // Solid line for true function
        this.graphCtx.beginPath();
        for (let x = 0; x <= this.graphCanvas.width; x++) {
            const scaledX = (x / this.graphCanvas.width) * 4 * Math.PI; // Scale to [0, 4π]
            const y = Math.sin(scaledX);
            const scaledY = this.graphCanvas.height / 2 - y * (this.graphCanvas.height / 2 - 20);
            if (x === 0) {
                this.graphCtx.moveTo(x, scaledY);
            } else {
                this.graphCtx.lineTo(x, scaledY);
            }
        }
        this.graphCtx.stroke();

        // Add the 'True Function' label on top of the graph
        this.graphCtx.fillStyle = '#00ffea';
        this.graphCtx.font = '14px Montserrat';
        this.graphCtx.fillText('True Function (y = sin(x))', 610, 30); // Position the label
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    sigmoidDerivative(output) {
        return output * (1 - output);
    }

    feedForward(input) {
        // Set input layer activation
        this.neurons.forEach(neuron => {
            if (neuron.layerIndex === 0) {
                neuron.activation = input;
            }
        });

        // Forward pass
        for (let l = 1; l < this.layers.length; l++) {
            for (let i = 0; i < this.layers[l]; i++) {
                let sum = 0;
                const layer = l - 1;
                const prevLayerStart = this.getLayerStart(layer);
                const currentLayerStart = this.getLayerStart(l);
                for (let j = 0; j < this.layers[layer]; j++) {
                    const fromNeuron = this.neurons[prevLayerStart + j];
                    const connection = this.getConnection(fromNeuron, this.neurons[currentLayerStart + i]);
                    sum += fromNeuron.activation * connection.weight;
                }
                const currentNeuron = this.neurons[currentLayerStart + i];
                currentNeuron.activation = this.sigmoid(sum);
            }
        }

        // Get output
        const outputLayerStart = this.getLayerStart(this.layers.length - 1);
        return this.neurons[outputLayerStart].activation;
    }

    backPropagate(target) {
        // Calculate error at output
        const outputLayerStart = this.getLayerStart(this.layers.length - 1);
        const outputNeuron = this.neurons[outputLayerStart];
        const output = outputNeuron.activation;
        const error = target - output;
        this.loss += error * error; // Accumulate squared error for MSE

        // Calculate delta for output neuron
        const deltaOutput = error * this.sigmoidDerivative(output);
        outputNeuron.delta = deltaOutput;

        // Calculate delta for hidden layers
        for (let l = this.layers.length - 2; l >= 1; l--) {
            const layerStart = this.getLayerStart(l);
            const nextLayerStart = this.getLayerStart(l + 1);
            for (let i = 0; i < this.layers[l]; i++) {
                let errorSum = 0;
                for (let j = 0; j < this.layers[l + 1]; j++) {
                    const connection = this.getConnection(this.neurons[layerStart + i], this.neurons[nextLayerStart + j]);
                    errorSum += connection.weight * this.neurons[nextLayerStart + j].delta;
                }
                const neuron = this.neurons[layerStart + i];
                neuron.delta = errorSum * this.sigmoidDerivative(neuron.activation);
            }
        }

        // Update weights
        for (let conn of this.connections) {
            const from = conn.from;
            const to = conn.to;
            conn.weight += this.learningRate * to.delta * from.activation;
        }
    }

    getLayerStart(layerIndex) {
        let start = 0;
        for (let l = 0; l < layerIndex; l++) {
            start += this.layers[l];
        }
        return start;
    }

    getConnection(from, to) {
        return this.connections.find(conn => conn.from === from && conn.to === to);
    }

    train() {
        // Generate training data
        const inputs = [];
        const targets = [];
        for (let i = 0; i < 1000; i++) { // Increased data points for better learning
            const x = Math.random() * 4 * Math.PI; // [0, 4π]
            const y = Math.sin(x);
            inputs.push(x);
            targets.push((y + 1) / 2); // Normalize to [0,1] for sigmoid
        }

        // Shuffle inputs
        for (let i = inputs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [inputs[i], inputs[j]] = [inputs[j], inputs[i]];
            [targets[i], targets[j]] = [targets[j], targets[i]];
        }

        // Train on each sample
        for (let i = 0; i < inputs.length; i++) {
            const output = this.feedForward(inputs[i] / (4 * Math.PI)); // Normalize input
            this.backPropagate(targets[i]);
        }

        this.currentEpoch += 1;

        // Calculate average loss (MSE)
        const averageLoss = this.loss / inputs.length;
        this.updateStats(this.currentEpoch, averageLoss);

        // Reset loss for next epoch
        this.loss = 0.0;

        // Update visualization every 100 epochs for performance
        if (this.currentEpoch % 10 === 0 || this.currentEpoch === this.maxEpochs) {
            this.plotFunction('training');
            this.drawNetwork();
            // Display epoch number below the graph
            this.displayEpochBelowGraph();
        }

        // Continue training until maxEpochs
        if (this.currentEpoch < this.maxEpochs) {
            requestAnimationFrame(() => this.train());
        } else {
            console.log('Training completed.');
            document.getElementById('trainBtn').disabled = true;
            document.getElementById('predictBtn').disabled = false;
        }
    }

    predict(x) {
        const normalizedX = x / (4 * Math.PI); // Normalize input
        const output = this.feedForward(normalizedX);
        return output * 2 - 1; // Denormalize output
    }

    plotFunction(type = 'training') {
        // Define colors and line styles based on type
        let color, lineStyle, labelPositionY;
        if (type === 'training') {
            color = '#ffae00'; // Amber for training curve
            lineStyle = 'dashed';
            labelPositionY = 120;
        } else if (type === 'final') {
            color = '#00ff00'; // Space green for final prediction
            lineStyle = 'dotted';
            labelPositionY = 120;
        }

        // Clear previous training curve or prepare for final prediction
        if (type === 'training' || type === 'final') {
            // Redraw the true function to erase previous curves
            this.initializeGraph();
        }

        // Set line style
        if (lineStyle === 'dashed') {
            this.graphCtx.setLineDash([5, 5]);
        } else if (lineStyle === 'dotted') {
            this.graphCtx.setLineDash([2, 3]);
        } else {
            this.graphCtx.setLineDash([]);
        }

        // Draw the specified function
        this.graphCtx.strokeStyle = color;
        this.graphCtx.lineWidth = 2;
        this.graphCtx.beginPath();
        for (let x = 0; x <= this.graphCanvas.width; x++) {
            let y;
            if (type === 'training') {
                y = this.feedForward((x / this.graphCanvas.width) * 4 * Math.PI / (4 * Math.PI)) * 2 - 1;
            } else if (type === 'final') {
                y = this.feedForward((x / this.graphCanvas.width) * 4 * Math.PI / (4 * Math.PI)) * 2 - 1;
            }
            const scaledY = this.graphCanvas.height / 2 - y * (this.graphCanvas.height / 2 - 20);
            if (x === 0) {
                this.graphCtx.moveTo(x, scaledY);
            } else {
                this.graphCtx.lineTo(x, scaledY);
            }
        }
        this.graphCtx.stroke();

        // Reset line dash
        this.graphCtx.setLineDash([]);

        // Add labels based on type
        if (type === 'training') {
            this.graphCtx.fillStyle = color;
            this.graphCtx.font = '14px Montserrat'; // Reduced font size
            this.graphCtx.fillText('Learned Function', 10, labelPositionY);
        } else if (type === 'final') {
            this.graphCtx.fillStyle = color;
            this.graphCtx.font = '14px Montserrat'; // Reduced font size
            this.graphCtx.fillText('Final Prediction', 10, labelPositionY);
        }
    }

    drawNetwork() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.connections.forEach(conn => conn.draw(this.ctx));

        // Draw neurons
        this.neurons.forEach(neuron => neuron.draw(this.ctx));
    }

    displayEpochBelowGraph() {
        // Display epoch number below the graph in the same color as the training curve
        const epochText = `Epoch: ${this.currentEpoch}/1000`;
        this.graphCtx.fillStyle = '#ffae00'; // Amber color
        this.graphCtx.font = '12px Montserrat'; // Reduced font size
        this.graphCtx.fillText(epochText, 10, this.graphCanvas.height - 10);
    }

    updateStats(epoch, mse) {
        // Update the stats display in the top-left corner
        document.getElementById('epoch').innerText = `${epoch}`;
        document.getElementById('loss').innerText = `${mse.toFixed(4)}`;
    }
}

let neuralNetwork = null;

// Initialize Neural Network Visualization
function initializeNeuralNetwork() {
    console.log('Initializing Neural Network Visualization');
    const canvas = document.getElementById('nnCanvas');
    const graphCanvas = document.getElementById('graphCanvas');
    if (!canvas || !graphCanvas) {
        console.error('Canvas element not found');
        return null;
    }

    // Resize canvases to fit container
    function resizeCanvases() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        graphCanvas.width = graphCanvas.clientWidth;
        graphCanvas.height = graphCanvas.clientHeight;

        if (neuralNetwork) {
            neuralNetwork.initializeNetwork();
            neuralNetwork.initializeGraph();
            neuralNetwork.drawNetwork();
        }
    }

    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    neuralNetwork = new NeuralNetwork(canvas, graphCanvas);
    neuralNetwork.drawNetwork();

    // Disable predict button initially
    document.getElementById('predictBtn').disabled = true;
}

// Handle Train Button Click
function handleTrain() {
    if (neuralNetwork) {
        document.getElementById('trainBtn').disabled = true;
        document.getElementById('predictBtn').disabled = true;
        neuralNetwork.train();
    }
}

// Handle Predict Button Click
function handlePredict() {
    if (neuralNetwork) {
        neuralNetwork.initializeGraph(); // Clear previous plots
        neuralNetwork.plotFunction('final');

        // Re-enable buttons after prediction
        document.getElementById('trainBtn').disabled = true;
        document.getElementById('predictBtn').disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeNeuralNetwork();

    const trainBtn = document.getElementById('trainBtn');
    const predictBtn = document.getElementById('predictBtn');

    if (trainBtn) trainBtn.addEventListener('click', handleTrain);
    if (predictBtn) predictBtn.addEventListener('click', handlePredict);
});

