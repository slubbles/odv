'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useODVProgram } from '@/lib/solana/hooks';
import { PLATFORM_ADMIN, PROGRAM_ID, EXPLORER_URL } from '@/lib/solana/config';

type Status = 'idle' | 'checking' | 'initializing' | 'success' | 'error';

export default function InitializePlatformPage() {
  const { publicKey, connected } = useWallet();
  const sdk = useODVProgram();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [platformConfig, setPlatformConfig] = useState<any>(null);

  const isAdmin = publicKey?.toString() === PLATFORM_ADMIN.toString();

  const checkPlatformStatus = async () => {
    if (!sdk) {
      setMessage('SDK not initialized. Please connect wallet.');
      return;
    }

    setStatus('checking');
    setMessage('Checking platform status on SOON Testnet...');

    try {
      const config = await sdk.getPlatformConfig();
      
      if (config) {
        setPlatformConfig(config);
        setStatus('success');
        setMessage('Platform is already initialized!');
      } else {
        setStatus('idle');
        setMessage('Platform not initialized yet. Click the button below to initialize.');
      }
    } catch (error: any) {
      if (error.message?.includes('Account does not exist')) {
        setStatus('idle');
        setMessage('Platform not initialized yet. Click the button below to initialize.');
      } else {
        setStatus('error');
        setMessage(`Error checking status: ${error.message}`);
      }
    }
  };

  const initializePlatform = async () => {
    if (!sdk || !publicKey) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!isAdmin) {
      setMessage('Only the admin wallet can initialize the platform');
      setStatus('error');
      return;
    }

    setStatus('initializing');
    setMessage('Initializing platform on SOON Testnet... Please approve the transaction.');

    try {
      const fixedBackingAmount = new BN(1_000_000); // 1 USDC
      const signature = await sdk.initializePlatform(fixedBackingAmount);

      setTxSignature(signature);
      setStatus('success');
      setMessage('Platform initialized successfully on SOON Testnet!');

      // Wait a bit then fetch the config
      setTimeout(() => checkPlatformStatus(), 2000);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
      console.error('Initialization error:', error);
    }
  };

  const isInitializing = status === 'initializing';
  const isChecking = status === 'checking';
  const showInitButton = connected && isAdmin && (status === 'idle' || status === 'error');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🚀 Platform Initialization</h1>
        <p className="text-center text-gray-400 mb-8">SOON Testnet</p>

        {/* Wallet Connection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. Connect Wallet</h2>
          <div className="flex items-center justify-between">
            <div>
              {connected ? (
                <div>
                  <p className="text-sm text-gray-400">Connected as:</p>
                  <p className="font-mono text-sm">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</p>
                  {isAdmin ? (
                    <p className="text-green-400 text-sm mt-1">✅ Admin Wallet</p>
                  ) : (
                    <p className="text-yellow-400 text-sm mt-1">⚠️ Not admin wallet</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">Not connected</p>
              )}
            </div>
            <WalletMultiButton />
          </div>
        </div>

        {/* Check Status */}
        {connected && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">2. Check Platform Status</h2>
            <button
              onClick={checkPlatformStatus}
              disabled={isChecking}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </button>
          </div>
        )}

        {/* Initialize Button */}
        {showInitButton && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">3. Initialize Platform</h2>
            <div className="mb-4 p-4 bg-gray-700 rounded">
              <p className="text-sm text-gray-300 mb-2">This will:</p>
              <ul className="text-sm text-gray-400 space-y-1 ml-4">
                <li>• Create the platform configuration account</li>
                <li>• Set fixed backing to 1 USDC ($1)</li>
                <li>• Set you as the platform admin</li>
                <li>• Cost: ~0.002 SOL</li>
              </ul>
            </div>
            <button
              onClick={initializePlatform}
              disabled={isInitializing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {isInitializing ? 'Initializing... Check Wallet' : 'Initialize Platform'}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {message && (
          <div className={`rounded-lg p-6 mb-6 ${
            status === 'success' ? 'bg-green-900/50 border border-green-500' :
            status === 'error' ? 'bg-red-900/50 border border-red-500' :
            isInitializing || isChecking ? 'bg-blue-900/50 border border-blue-500' :
            'bg-gray-800'
          }`}>
            <p className="font-semibold mb-2">
              {status === 'success' && '✅ Success'}
              {status === 'error' && '❌ Error'}
              {isInitializing && '⏳ Processing'}
              {isChecking && '🔍 Checking'}
              {status === 'idle' && 'ℹ️ Info'}
            </p>
            <p className="text-sm">{message}</p>

            {txSignature && (
              <div className="mt-4">
                <a
                  href={`${EXPLORER_URL}/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  View transaction on SOON Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Platform Config Display */}
        {platformConfig && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">✅ Platform Configuration</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Admin:</span>
                <span className="font-mono">{platformConfig.admin.toString().slice(0, 8)}...{platformConfig.admin.toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fixed Backing:</span>
                <span>{Number(platformConfig.fixedBackingAmount) / 1_000_000} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Campaigns:</span>
                <span>{platformConfig.totalCampaigns?.toString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Backers:</span>
                <span>{platformConfig.totalBackers?.toString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={platformConfig.paused ? 'text-red-400' : 'text-green-400'}>
                  {platformConfig.paused ? 'Paused' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-2">📋 Important Info</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• <strong>Network:</strong> SOON Testnet</li>
            <li>• <strong>Program ID:</strong> <span className="font-mono text-xs">{PROGRAM_ID.toString()}</span></li>
            <li>• <strong>Admin Wallet:</strong> <span className="font-mono text-xs">{PLATFORM_ADMIN.toString()}</span></li>
            <li>• <strong>Required:</strong> ~0.002 SOL for initialization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
