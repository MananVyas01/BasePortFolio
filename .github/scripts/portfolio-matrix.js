#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

class PortfolioMatrix {
    constructor() {
        this.username = 'MananVyas01';
        this.matrixData = [];
    }

    async generateMatrix() {
        console.log('🔮 Generating Portfolio Matrix...');
        
        try {
            // Fetch GitHub data
            const userResponse = await axios.get(`https://api.github.com/users/${this.username}`);
            const reposResponse = await axios.get(`https://api.github.com/users/${this.username}/repos?per_page=100`);
            
            const user = userResponse.data;
            const repos = reposResponse.data;
            
            // Generate matrix visualization
            const matrix = this.createActivityMatrix(repos);
            
            // Create ASCII art
            const asciiArt = this.generateAsciiArt(user, repos);
            
            // Generate HTML embed
            const htmlEmbed = this.generateHtmlEmbed(matrix, asciiArt);
            
            // Save to file
            fs.writeFileSync('portfolio-matrix.html', htmlEmbed);
            
            console.log('✅ Matrix generated successfully!');
            
        } catch (error) {
            console.error('❌ Error generating matrix:', error.message);
        }
    }

    createActivityMatrix(repos) {
        // Create a 10x10 grid representing activity
        const matrix = Array(10).fill().map(() => Array(10).fill(0));
        
        repos.forEach((repo, index) => {
            if (index < 100) {
                const row = Math.floor(index / 10);
                const col = index % 10;
                matrix[row][col] = repo.stargazers_count + repo.forks_count;
            }
        });
        
        return matrix;
    }

    generateAsciiArt(user, repos) {
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
        
        return `
    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗ ███╗   ██╗
    ████╗ ████║██╔══██╗████╗  ██║██╔══██╗████╗  ██║
    ██╔████╔██║███████║██╔██╗ ██║███████║██╔██╗ ██║
    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║╚██╗██║
    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║██║ ╚████║
    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝
    
    ░▒▓█ PORTFOLIO MATRIX █▓▒░
    
    👤 Developer: ${user.name}
    🌟 Stars: ${totalStars}
    🍴 Forks: ${totalForks}
    📦 Repos: ${repos.length}
    👥 Followers: ${user.followers}
    
    ▓▒░ ENTERING THE MATRIX ░▒▓
        `;
    }

    generateHtmlEmbed(matrix, asciiArt) {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Portfolio Matrix</title>
    <style>
        body {
            background: #000;
            color: #0f0;
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 20px;
            overflow: hidden;
        }
        
        .matrix-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
            justify-content: center;
        }
        
        .ascii-art {
            white-space: pre;
            font-size: 12px;
            margin-bottom: 20px;
            text-align: center;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        .matrix-grid {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: 5px;
            margin: 20px 0;
        }
        
        .matrix-cell {
            width: 30px;
            height: 30px;
            background: rgba(0, 255, 0, 0.1);
            border: 1px solid #0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            animation: pulse 2s infinite;
        }
        
        .matrix-cell.active {
            background: rgba(0, 255, 0, 0.8);
            box-shadow: 0 0 10px #0f0;
        }
        
        @keyframes glow {
            from { text-shadow: 0 0 5px #0f0; }
            to { text-shadow: 0 0 20px #0f0, 0 0 30px #0f0; }
        }
        
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
        }
        
        .matrix-rain {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .rain-drop {
            position: absolute;
            color: #0f0;
            font-size: 14px;
            animation: rain linear infinite;
        }
        
        @keyframes rain {
            0% { transform: translateY(-100vh); opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="matrix-rain"></div>
    <div class="matrix-container">
        <div class="ascii-art">${asciiArt}</div>
        <div class="matrix-grid">
            ${matrix.flat().map((value, index) => 
                `<div class="matrix-cell ${value > 0 ? 'active' : ''}">${value}</div>`
            ).join('')}
        </div>
    </div>
    
    <script>
        // Create matrix rain effect
        function createRainDrop() {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.textContent = Math.random() < 0.5 ? '1' : '0';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.querySelector('.matrix-rain').appendChild(drop);
            
            setTimeout(() => {
                drop.remove();
            }, 5000);
        }
        
        setInterval(createRainDrop, 100);
        
        // Update matrix every 5 seconds
        setInterval(() => {
            const cells = document.querySelectorAll('.matrix-cell');
            cells.forEach(cell => {
                if (Math.random() < 0.1) {
                    cell.classList.toggle('active');
                }
            });
        }, 5000);
    </script>
</body>
</html>
        `;
    }
}

// Run the matrix generator
const matrix = new PortfolioMatrix();
matrix.generateMatrix();
