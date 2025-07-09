import React, { useState } from 'react';
import { 
  Wallet, 
  Globe, 
  Code, 
  Coins, 
  Settings, 
  Plus, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Database,
  Zap,
  Shield,
  RefreshCw
} from 'lucide-react';

interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  chainId: number;
  symbol: string;
  explorer: string;
  testnet: boolean;
}

interface Token {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change: string;
  address: string;
}

interface Contract {
  name: string;
  address: string;
  network: string;
  type: 'ERC20' | 'ERC721' | 'Custom';
  verified: boolean;
}

const Web3Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'contracts' | 'deploy' | 'networks'>('wallet');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');

  const networks: Network[] = [
    {
      id: 'ethereum',
      name: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/',
      chainId: 1,
      symbol: 'ETH',
      explorer: 'https://etherscan.io',
      testnet: false
    },
    {
      id: 'sepolia',
      name: 'Sepolia Testnet',
      rpcUrl: 'https://sepolia.infura.io/v3/',
      chainId: 11155111,
      symbol: 'ETH',
      explorer: 'https://sepolia.etherscan.io',
      testnet: true
    },
    {
      id: 'polygon',
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
      chainId: 137,
      symbol: 'MATIC',
      explorer: 'https://polygonscan.com',
      testnet: false
    },
    {
      id: 'bsc',
      name: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org',
      chainId: 56,
      symbol: 'BNB',
      explorer: 'https://bscscan.com',
      testnet: false
    }
  ];

  const tokens: Token[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '2.45',
      value: '$4,890.00',
      change: '+2.3%',
      address: '0x0000000000000000000000000000000000000000'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '1,250.00',
      value: '$1,250.00',
      change: '+0.1%',
      address: '0xA0b86a33E6441b8435b662da0C0E5B2c0B0b0b0b'
    },
    {
      symbol: 'UNI',
      name: 'Uniswap',
      balance: '45.2',
      value: '$315.40',
      change: '-1.2%',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
    }
  ];

  const contracts: Contract[] = [
    {
      name: 'MyToken',
      address: '0x742d35Cc6634C0532925a3b8D0C0E5B2c0B0b0b0',
      network: 'ethereum',
      type: 'ERC20',
      verified: true
    },
    {
      name: 'NFTCollection',
      address: '0x8ba1f109551bD432803012645Hac136c0C0E5B2c',
      network: 'polygon',
      type: 'ERC721',
      verified: false
    }
  ];

  const handleConnect = () => {
    setIsConnected(!isConnected);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderWalletTab = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Wallet Connection</h3>
          <button
            onClick={handleConnect}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isConnected
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </button>
        </div>
        
        {isConnected && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">Connected to MetaMask</span>
            </div>
            <div className="flex items-center justify-between bg-gray-700 rounded p-3">
              <span className="text-gray-300 text-sm">0x742d35Cc6634C0532925a3b8D0C0E5B2c0B0b0b0</span>
              <button
                onClick={() => copyToClipboard('0x742d35Cc6634C0532925a3b8D0C0E5B2c0B0b0b0')}
                className="p-1 text-gray-400 hover:text-white"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Network Selection */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Network</h3>
        <select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
        >
          {networks.map((network) => (
            <option key={network.id} value={network.id}>
              {network.name} {network.testnet && '(Testnet)'}
            </option>
          ))}
        </select>
      </div>

      {/* Token Portfolio */}
      {isConnected && (
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Portfolio</h3>
            <button className="p-2 text-gray-400 hover:text-white">
              <RefreshCw size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {tokens.map((token) => (
              <div key={token.symbol} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Coins size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{token.balance}</div>
                  <div className="text-gray-400 text-sm">{token.value}</div>
                  <div className={`text-sm ${
                    token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {token.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContractsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Smart Contracts</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
          <Plus size={16} />
          <span>Add Contract</span>
        </button>
      </div>

      <div className="space-y-3">
        {contracts.map((contract, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Code size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{contract.name}</div>
                  <div className="text-gray-400 text-sm">{contract.type} • {contract.network}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {contract.verified ? (
                  <Shield size={16} className="text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-yellow-400" />
                )}
                <button className="p-1 text-gray-400 hover:text-white">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-gray-700 rounded p-2">
              <span className="text-gray-300 text-sm font-mono">{contract.address}</span>
              <button
                onClick={() => copyToClipboard(contract.address)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeployTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Deploy Contract</h3>
      
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contract Type</label>
          <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none">
            <option>ERC20 Token</option>
            <option>ERC721 NFT</option>
            <option>Custom Contract</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contract Name</label>
          <input
            type="text"
            placeholder="MyToken"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
          <input
            type="text"
            placeholder="MTK"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Total Supply</label>
          <input
            type="number"
            placeholder="1000000"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gas Limit</label>
          <input
            type="number"
            placeholder="2000000"
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-400 focus:outline-none"
          />
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors">
          Deploy Contract
        </button>
      </div>
    </div>
  );

  const renderNetworksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Networks</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
          <Plus size={16} />
          <span>Add Network</span>
        </button>
      </div>

      <div className="space-y-3">
        {networks.map((network) => (
          <div key={network.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  network.testnet ? 'bg-yellow-400' : 'bg-green-400'
                }`} />
                <div>
                  <div className="text-white font-medium">{network.name}</div>
                  <div className="text-gray-400 text-sm">Chain ID: {network.chainId}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{network.symbol}</span>
                <button className="p-1 text-gray-400 hover:text-white">
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 font-mono bg-gray-700 rounded p-2">
              {network.rpcUrl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center space-x-2">
          <Zap className="text-blue-400" size={20} />
          <h2 className="text-white font-semibold">Web3 Tools</h2>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-4">
        <div className="flex space-x-1">
          {[
            { id: 'wallet', label: 'Wallet', icon: Wallet },
            { id: 'contracts', label: 'Contracts', icon: Code },
            { id: 'deploy', label: 'Deploy', icon: Database },
            { id: 'networks', label: 'Networks', icon: Globe }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'wallet' && renderWalletTab()}
        {activeTab === 'contracts' && renderContractsTab()}
        {activeTab === 'deploy' && renderDeployTab()}
        {activeTab === 'networks' && renderNetworksTab()}
      </div>
    </div>
  );
};

export default Web3Tools;