'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useODVProgram } from '@/lib/solana/hooks';
import { PLATFORM_ADMIN, PROGRAM_ID, EXPLORER_URL } from '@/lib/solana/config';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, ExternalLink, Shield, Wallet, Zap } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">
            Admin Only
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Platform Initialization</h1>
          <p className="text-muted-foreground">SOON Testnet Configuration</p>
        </div>

        {/* Wallet Connection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              1. Connect Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {connected ? (
                  <div>
                    <p className="text-sm text-muted-foreground">Connected as:</p>
                    <p className="font-mono text-sm">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</p>
                    {isAdmin ? (
                      <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Admin Wallet
                      </Badge>
                    ) : (
                      <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Admin Wallet
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not connected</p>
                )}
              </div>
              <WalletMultiButton />
            </div>
          </CardContent>
        </Card>

        {/* Check Status */}
        {connected && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                2. Check Platform Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={checkPlatformStatus}
                disabled={isChecking}
                variant="outline"
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Status'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Initialize Button */}
        {showInitButton && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                3. Initialize Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm mb-2">This will:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Create the platform configuration account</li>
                  <li>• Set fixed backing to 1 USDC ($1)</li>
                  <li>• Set you as the platform admin</li>
                  <li>• Cost: ~0.002 SOL</li>
                </ul>
              </div>
              <Button
                onClick={initializePlatform}
                disabled={isInitializing}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing... Check Wallet
                  </>
                ) : (
                  'Initialize Platform'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Status Messages */}
        {message && (
          <Card className={`mb-6 ${
            status === 'success' ? 'border-green-500/50' :
            status === 'error' ? 'border-red-500/50' :
            isInitializing || isChecking ? 'border-accent/50' :
            ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                {status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />}
                {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />}
                {(isInitializing || isChecking) && <Loader2 className="h-5 w-5 text-accent animate-spin shrink-0 mt-0.5" />}
                <div>
                  <p className="font-semibold mb-1">
                    {status === 'success' && 'Success'}
                    {status === 'error' && 'Error'}
                    {isInitializing && 'Processing'}
                    {isChecking && 'Checking'}
                    {status === 'idle' && 'Info'}
                  </p>
                  <p className="text-sm text-muted-foreground">{message}</p>
                </div>
              </div>

              {txSignature && (
                <div className="mt-4 pt-4 border-t border-border">
                  <a
                    href={`${EXPLORER_URL}/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-accent hover:text-accent/80 text-sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View transaction on SOON Explorer
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Platform Config Display */}
        {platformConfig && (
          <Card className="mb-6 border-green-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin:</span>
                  <span className="font-mono">{platformConfig.admin.toString().slice(0, 8)}...{platformConfig.admin.toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fixed Backing:</span>
                  <span>{Number(platformConfig.fixedBackingAmount) / 1_000_000} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Campaigns:</span>
                  <span>{platformConfig.totalCampaigns?.toString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Backers:</span>
                  <span>{platformConfig.totalBackers?.toString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={platformConfig.paused ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}>
                    {platformConfig.paused ? 'Paused' : 'Active'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Box */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex justify-between">
                <span>Network:</span>
                <span className="font-semibold text-foreground">SOON Testnet</span>
              </li>
              <li className="flex justify-between">
                <span>Program ID:</span>
                <span className="font-mono text-xs truncate ml-4">{PROGRAM_ID.toString()}</span>
              </li>
              <li className="flex justify-between">
                <span>Admin Wallet:</span>
                <span className="font-mono text-xs truncate ml-4">{PLATFORM_ADMIN.toString()}</span>
              </li>
              <li className="flex justify-between">
                <span>Required SOL:</span>
                <span className="font-semibold text-foreground">~0.002 SOL</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
