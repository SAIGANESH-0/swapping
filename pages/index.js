import React, { useState, useEffect } from "react";
import axios from "axios";
import Web3 from "web3";
import BigNumber from "bignumber.js";

const TokenSwap = () => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [to, setTo] = useState(0);
  const [name, setName] = useState("");
  const [tokenOptions, setTokenOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [but, setbut] = useState("Connect Wallet");
  const [dec, setdec] = useState(10 ** 18);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(
          "https://tokens.coingecko.com/uniswap/all.json"
        );

        let tokens = response.data.tokens;

        for (let index = 0; index < tokens.length; index++) {
          tokens[index].name = tokens[index].name.toLowerCase();
        }
        setTokenOptions(tokens);
        console.log(tokens);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTokens();
  }, []);

  const handleSwap = async () => {
    let se = await fetch(
      `https://api.0x.org/swap/v1/price?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${
        amount * dec
      }`
    );
    se = await se.json();
    if (se.price) {
      setTo(se.price);
    }
  };

  const performSwap = async () => {
    const erc20abi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint256", name: "max_supply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const web3 = new Web3(Web3.givenProvider);

    // The address, if any, of the most recently used account that the caller is permitted to access
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let takerAddress = accounts[0];

    let resp = await fetch(
      `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${
        amount * dec
      }`
    );
    //&takerAddress=${accounts[0]}
    resp = await resp.json();

    // Set Token Allowance
    // Set up approval amount
    const fromTokenAddress = tokenOptions.filter(
      (x) => x.name.toLowerCase() === fromToken.toLowerCase()
    )[0].address;
    const maxApproval = new BigNumber(2).pow(256).minus(1);

    const ERC20TokenContract = new web3.eth.Contract(
      erc20abi,
      fromTokenAddress
    );

    // Grant the allowance target an allowance to spend our tokens.
    const tx = await ERC20TokenContract.methods
      .approve(resp.allowanceTarget, maxApproval)
      .send({ from: takerAddress })
      .then((tx) => {
        console.log("tx: ", tx);
      });

    resp.from = takerAddress;

    // Perform the swap
    const receipt = await web3.eth.sendTransaction(resp);
    console.log("receipt: ", receipt);
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        setbut("Connected");
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  const handleSearch = () => {
    let Name = name;
    Name = Name.toLowerCase();
    let filtered = tokenOptions.filter((x) => x.name === Name);
    if (filtered.length) {
      setName(filtered[0].symbol);
    } else {
      setName("not found");
    }
  };

  return (
    <div className="flex flex-col bg-orange-300 min-h-screen">
      <header className="flex justify-between items-center py-4 px-6 border-b">
        <h1 className="text-3xl font-bold">TokenSwap</h1>
        <button
          onClick={connect}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {but}
        </button>
      </header>

      <div className="flex mt-7 mb-2 justify-center">
        <input
          className="border border-gray-400 p-2 mr-2 w-1/2"
          type="text"
          placeholder="Enter token name"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 ml-2 rounded"
        >
          Search for Symbol
        </button>
      </div>

      <div className="p-6">
        <h1 className="mb-2 text-xl">{name}</h1>
        <h1>
          Enter the details of the token to convert from below
          <span className="text-red-500"> (Required)</span>
        </h1>
        <div className="flex mt-2 items-center justify-center">
          <input
            className="border border-red-500 p-2 mr-2 w-1/2"
            type="text"
            placeholder="Enter amount (required)"
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            className="border border-red-500 p-2 ml-2 w-1/2"
            type="text"
            placeholder="Enter symbol (required)"
            onChange={(e) => setFromToken(e.target.value.toUpperCase())}
          />
        </div>
        <h1 className="mt-12">
          Enter the details of the token to convert to below
        </h1>
        <div className="mt-2 flex items-center justify-center">
          <input
            className="border border-gray-400 p-2 mr-2 w-1/2"
            type="text"
            value={to}
          />
          <input
            className="border border-red-500 p-2 ml-2 w-1/2"
            type="text"
            placeholder="Enter symbol (required)"
            onChange={(e) => setToToken(e.target.value.toUpperCase())}
          />
        </div>
        <div className="flex mt-7 justify-center">
          <button
            onClick={handleSwap}
            className="bg-green-600  hover:bg-green-800 text-white font-bold py-2 px-4 ml-2 rounded"
          >
            Get Price
          </button>
          <button
            onClick={performSwap}
            className="bg-pink-500  hover:bg-pink-700 text-white font-bold py-2 px-4 ml-2 rounded"
          >
            Swap Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
