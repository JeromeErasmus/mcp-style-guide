#!/bin/bash

# Australian Style Manual MCP Server - One-line installer for Claude Code
# Usage: curl -sSL https://raw.githubusercontent.com/user/mcp-style-guide/main/install.sh | bash

set -e

echo "🔧 Installing Australian Style Manual MCP Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is required but not installed. Please install Yarn first."
    exit 1
fi

# Create installation directory
INSTALL_DIR="$HOME/.local/share/claude-code/mcp-servers/australian-style-manual"
echo "📁 Creating directory: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"

# Clone or download the repository
echo "📥 Downloading Australian Style Manual MCP Server..."
if command -v git &> /dev/null; then
    git clone https://github.com/user/mcp-style-guide.git "$INSTALL_DIR" 2>/dev/null || {
        echo "⚠️  Git clone failed, downloading as zip..."
        curl -L -o /tmp/mcp-style-guide.zip https://github.com/user/mcp-style-guide/archive/main.zip
        unzip -q /tmp/mcp-style-guide.zip -d /tmp/
        cp -r /tmp/mcp-style-guide-main/* "$INSTALL_DIR/"
        rm -rf /tmp/mcp-style-guide*
    }
else
    curl -L -o /tmp/mcp-style-guide.zip https://github.com/user/mcp-style-guide/archive/main.zip
    unzip -q /tmp/mcp-style-guide.zip -d /tmp/
    cp -r /tmp/mcp-style-guide-main/* "$INSTALL_DIR/"
    rm -rf /tmp/mcp-style-guide*
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
cd "$INSTALL_DIR"
yarn install --silent
echo "🔨 Building project..."
yarn build

# Configure Claude Code MCP settings
MCP_CONFIG_DIR="$HOME/.config/claude-code"
MCP_CONFIG_FILE="$MCP_CONFIG_DIR/mcp_settings.json"

echo "⚙️  Configuring Claude Code..."
mkdir -p "$MCP_CONFIG_DIR"

# Create or update MCP configuration
if [ -f "$MCP_CONFIG_FILE" ]; then
    # Backup existing config
    cp "$MCP_CONFIG_FILE" "$MCP_CONFIG_FILE.backup"
    echo "💾 Backed up existing MCP config to $MCP_CONFIG_FILE.backup"
    
    # Add our server to existing config (basic approach)
    if ! grep -q "australian-style-manual" "$MCP_CONFIG_FILE"; then
        # Insert our server config (assumes valid JSON structure)
        sed -i.tmp 's/"mcpServers": {/"mcpServers": {\n    "australian-style-manual": {\n      "command": "node",\n      "args": ["'"$INSTALL_DIR"'\/dist\/server.js"]\n    },/' "$MCP_CONFIG_FILE"
        rm "$MCP_CONFIG_FILE.tmp" 2>/dev/null || true
    fi
else
    # Create new config file
    cat > "$MCP_CONFIG_FILE" << EOF
{
  "mcpServers": {
    "australian-style-manual": {
      "command": "node",
      "args": ["$INSTALL_DIR/dist/server.js"]
    }
  }
}
EOF
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Restart Claude Code to load the new MCP server"
echo "2. Run: download_all_content({ outputDir: \"./style-manual\" })"
echo "3. Start using instant local searches with grep/read commands"
echo ""
echo "📍 Installed to: $INSTALL_DIR"
echo "⚙️  Config file: $MCP_CONFIG_FILE"
echo ""
echo "🔍 Test with: 'Download all Australian Style Manual content'"