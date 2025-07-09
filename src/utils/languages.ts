export interface LanguageConfig {
  id: string;
  name: string;
  extensions: string[];
  icon: string;
  color: string;
  keywords: string[];
  snippets: { [key: string]: string };
  defaultContent: string;
}

export const languages: { [key: string]: LanguageConfig } = {
  solidity: {
    id: 'solidity',
    name: 'Solidity',
    extensions: ['.sol'],
    icon: '⟠',
    color: 'text-purple-400',
    keywords: [
      'pragma', 'contract', 'interface', 'library', 'function', 'modifier',
      'event', 'struct', 'enum', 'mapping', 'address', 'uint256', 'uint',
      'int256', 'int', 'bool', 'string', 'bytes', 'bytes32', 'public',
      'private', 'internal', 'external', 'view', 'pure', 'payable',
      'constant', 'immutable', 'storage', 'memory', 'calldata', 'constructor',
      'fallback', 'receive', 'require', 'assert', 'revert', 'emit',
      'return', 'if', 'else', 'for', 'while', 'do', 'break', 'continue',
      'try', 'catch', 'throw', 'using', 'import', 'as', 'is'
    ],
    snippets: {
      contract: `pragma solidity ^0.8.0;

contract MyContract {
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}`,
      erc20: `pragma solidity ^0.8.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract ERC20Token is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 private _totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;
    
    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        _totalSupply = _totalSupply * 10**decimals;
        _balances[msg.sender] = _totalSupply;
    }
    
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        _balances[to] += amount;
        return true;
    }
    
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        require(_allowances[from][msg.sender] >= amount, "Allowance exceeded");
        require(_balances[from] >= amount, "Insufficient balance");
        
        _allowances[from][msg.sender] -= amount;
        _balances[from] -= amount;
        _balances[to] += amount;
        return true;
    }
}`
    },
    defaultContent: `pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

contract HelloWorld {
    string public message;
    
    constructor() {
        message = "Hello, Web3 World!";
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    extensions: ['.rs'],
    icon: '🦀',
    color: 'text-orange-400',
    keywords: [
      'fn', 'let', 'mut', 'const', 'static', 'struct', 'enum', 'impl',
      'trait', 'type', 'use', 'mod', 'pub', 'crate', 'super', 'self',
      'Self', 'match', 'if', 'else', 'loop', 'while', 'for', 'in',
      'break', 'continue', 'return', 'move', 'ref', 'async', 'await',
      'unsafe', 'extern', 'where', 'as', 'dyn', 'Box', 'Vec', 'String',
      'Option', 'Result', 'Some', 'None', 'Ok', 'Err', 'true', 'false'
    ],
    snippets: {
      main: `fn main() {
    println!("Hello, Rust!");
}`,
      substrate_pallet: `use frame_support::{
    decl_module, decl_storage, decl_event, decl_error,
    dispatch::{DispatchResult, DispatchError},
    traits::{Get, Randomness},
};
use frame_system::ensure_signed;
use sp_std::vec::Vec;

pub trait Trait: frame_system::Trait {
    type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}

decl_storage! {
    trait Store for Module<T: Trait> as MyPallet {
        Something get(fn something): Option<u32>;
    }
}

decl_event!(
    pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
        SomethingStored(u32, AccountId),
    }
);

decl_error! {
    pub enum Error for Module<T: Trait> {
        NoneValue,
        StorageOverflow,
    }
}

decl_module! {
    pub struct Module<T: Trait> for enum Call where origin: T::Origin {
        type Error = Error<T>;
        fn deposit_event() = default;
        
        #[weight = 10_000 + T::DbWeight::get().writes(1)]
        pub fn do_something(origin, something: u32) -> DispatchResult {
            let who = ensure_signed(origin)?;
            Something::put(something);
            Self::deposit_event(RawEvent::SomethingStored(something, who));
            Ok(())
        }
    }
}`,
      blockchain_node: `use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub index: u64,
    pub timestamp: u64,
    pub data: String,
    pub previous_hash: String,
    pub hash: String,
    pub nonce: u64,
}

impl Block {
    pub fn new(index: u64, data: String, previous_hash: String) -> Self {
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let mut block = Block {
            index,
            timestamp,
            data,
            previous_hash,
            hash: String::new(),
            nonce: 0,
        };
        
        block.mine_block(4); // Difficulty of 4
        block
    }
    
    pub fn calculate_hash(&self) -> String {
        let input = format!("{}{}{}{}{}", 
            self.index, self.timestamp, self.data, self.previous_hash, self.nonce);
        let mut hasher = Sha256::new();
        hasher.update(input.as_bytes());
        format!("{:x}", hasher.finalize())
    }
    
    pub fn mine_block(&mut self, difficulty: usize) {
        let target = "0".repeat(difficulty);
        while &self.calculate_hash()[..difficulty] != target {
            self.nonce += 1;
        }
        self.hash = self.calculate_hash();
    }
}

#[derive(Debug)]
pub struct Blockchain {
    pub chain: Vec<Block>,
    pub difficulty: usize,
}

impl Blockchain {
    pub fn new() -> Self {
        let mut blockchain = Blockchain {
            chain: Vec::new(),
            difficulty: 4,
        };
        blockchain.create_genesis_block();
        blockchain
    }
    
    fn create_genesis_block(&mut self) {
        let genesis_block = Block::new(0, "Genesis Block".to_string(), "0".to_string());
        self.chain.push(genesis_block);
    }
    
    pub fn add_block(&mut self, data: String) {
        let previous_block = self.chain.last().unwrap();
        let new_block = Block::new(
            previous_block.index + 1,
            data,
            previous_block.hash.clone(),
        );
        self.chain.push(new_block);
    }
    
    pub fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current_block = &self.chain[i];
            let previous_block = &self.chain[i - 1];
            
            if current_block.hash != current_block.calculate_hash() {
                return false;
            }
            
            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }
}`
    },
    defaultContent: `fn main() {
    println!("Hello, Rust Blockchain!");
    
    // Example: Simple blockchain structure
    let mut blockchain = Vec::new();
    
    // Genesis block
    blockchain.push("Genesis Block");
    
    println!("Blockchain initialized with {} blocks", blockchain.len());
}`
  },
  vyper: {
    id: 'vyper',
    name: 'Vyper',
    extensions: ['.vy'],
    icon: '🐍',
    color: 'text-green-400',
    keywords: [
      'def', 'event', 'struct', 'interface', 'implements', 'contract',
      'public', 'private', 'internal', 'external', 'view', 'pure',
      'payable', 'nonpayable', 'constant', 'immutable', 'indexed',
      'log', 'assert', 'raise', 'return', 'pass', 'if', 'else',
      'elif', 'for', 'in', 'range', 'break', 'continue', 'and',
      'or', 'not', 'True', 'False', 'None', 'self', 'msg', 'block',
      'tx', 'chain', 'address', 'uint256', 'int256', 'bool', 'bytes32',
      'String', 'Bytes', 'HashMap', 'DynArray'
    ],
    snippets: {
      contract: `# @version ^0.3.0

@external
def __init__():
    pass

@external
@view
def get_balance() -> uint256:
    return self.balance

@external
@payable
def deposit():
    log Deposit(msg.sender, msg.value)

event Deposit:
    sender: indexed(address)
    amount: uint256`
    },
    defaultContent: `# @version ^0.3.0
# Simple Vyper contract

owner: public(address)

@external
def __init__():
    self.owner = msg.sender

@external
@view
def get_owner() -> address:
    return self.owner`
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extensions: ['.js', '.mjs'],
    icon: '📜',
    color: 'text-yellow-400',
    keywords: [
      'const', 'let', 'var', 'function', 'return', 'if', 'else',
      'for', 'while', 'do', 'break', 'continue', 'switch', 'case',
      'default', 'try', 'catch', 'finally', 'throw', 'async', 'await',
      'class', 'extends', 'constructor', 'super', 'this', 'new',
      'import', 'export', 'from', 'as', 'default', 'true', 'false',
      'null', 'undefined', 'typeof', 'instanceof', 'in', 'of'
    ],
    snippets: {
      web3_connection: `const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

async function connectToBlockchain() {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Connected accounts:', accounts);
        
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
    } catch (error) {
        console.error('Connection failed:', error);
    }
}

connectToBlockchain();`,
      smart_contract_interaction: `const contractABI = [/* Your contract ABI */];
const contractAddress = '0x...';

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function interactWithContract() {
    const accounts = await web3.eth.getAccounts();
    
    // Call a view function
    const result = await contract.methods.someViewFunction().call();
    console.log('View function result:', result);
    
    // Send a transaction
    const tx = await contract.methods.someFunction(param1, param2).send({
        from: accounts[0],
        gas: 200000
    });
    
    console.log('Transaction hash:', tx.transactionHash);
}`,
      erc20_deployment: `const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const mnemonic = 'your twelve word mnemonic here';
const infuraUrl = 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID';

const provider = new HDWalletProvider(mnemonic, infuraUrl);
const web3 = new Web3(provider);

const contractABI = [/* ERC20 ABI */];
const contractBytecode = '0x...'; // Contract bytecode

async function deployERC20() {
    const accounts = await web3.eth.getAccounts();
    
    const contract = new web3.eth.Contract(contractABI);
    
    const deployTx = contract.deploy({
        data: contractBytecode,
        arguments: ['MyToken', 'MTK', 1000000] // name, symbol, totalSupply
    });
    
    const deployedContract = await deployTx.send({
        from: accounts[0],
        gas: 2000000
    });
    
    console.log('Contract deployed at:', deployedContract.options.address);
}`
    },
    defaultContent: `// Web3 JavaScript Development
const Web3 = require('web3');

// Connect to Ethereum network
const web3 = new Web3('http://localhost:8545');

console.log('Web3 initialized for blockchain development');`
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    icon: '📘',
    color: 'text-blue-400',
    keywords: [
      'interface', 'type', 'enum', 'namespace', 'module', 'declare',
      'abstract', 'implements', 'extends', 'public', 'private',
      'protected', 'readonly', 'static', 'const', 'let', 'var',
      'function', 'return', 'if', 'else', 'for', 'while', 'do',
      'break', 'continue', 'switch', 'case', 'default', 'try',
      'catch', 'finally', 'throw', 'async', 'await', 'class',
      'constructor', 'super', 'this', 'new', 'import', 'export',
      'from', 'as', 'default', 'true', 'false', 'null', 'undefined'
    ],
    snippets: {
      dapp_types: `interface ContractConfig {
  address: string;
  abi: any[];
  network: 'mainnet' | 'testnet' | 'localhost';
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  blockNumber: number;
}

interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  contractAddress: string;
}

class Web3Service {
  private web3: any;
  private contract: any;
  
  constructor(config: ContractConfig) {
    // Initialize Web3 and contract
  }
  
  async getBalance(address: string): Promise<string> {
    return await this.web3.eth.getBalance(address);
  }
  
  async sendTransaction(to: string, value: string): Promise<Transaction> {
    // Implementation
    return {} as Transaction;
  }
}`
    },
    defaultContent: `// TypeScript for Web3 Development
interface BlockchainConfig {
  networkId: number;
  rpcUrl: string;
  contractAddress: string;
}

const config: BlockchainConfig = {
  networkId: 1,
  rpcUrl: 'http://localhost:8545',
  contractAddress: '0x...'
};

console.log('TypeScript Web3 setup complete');`
  }
};

export const getLanguageFromExtension = (extension: string): LanguageConfig => {
  const ext = extension.toLowerCase();
  for (const lang of Object.values(languages)) {
    if (lang.extensions.includes(ext)) {
      return lang;
    }
  }
  return languages.javascript; // Default fallback
};

export const getLanguageById = (id: string): LanguageConfig => {
  return languages[id] || languages.javascript;
};