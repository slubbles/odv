#!/bin/bash
# Monitor relayer wallet balance and alert if low

RELAYER_ADDRESS="G69hBDyPLCb29s4WVe6AcoiiJyjNHxAkhx2PYwzLeR6g"
RPC_URL="https://rpc.testnet.soo.network/rpc"
SOLANA_BIN="$HOME/.local/share/solana/install/active_release/bin/solana"

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔋 Relayer Wallet Balance Monitor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Wallet: $RELAYER_ADDRESS"
echo ""

# Get balance
BALANCE=$($SOLANA_BIN balance $RELAYER_ADDRESS --url $RPC_URL 2>/dev/null | awk '{print $1}')

if [ -z "$BALANCE" ]; then
    echo -e "${RED}❌ Failed to fetch balance${NC}"
    exit 1
fi

echo "Current Balance: $BALANCE SOL"
echo ""

# Calculate remaining backings (assuming $0.02 per backing = ~0.00075 SOL)
BACKINGS_REMAINING=$(awk "BEGIN {printf \"%.0f\", $BALANCE / 0.00075}")
echo "Estimated Backings Remaining: ~$BACKINGS_REMAINING"
echo ""

# Check thresholds and alert (using awk for floating point comparison)
CRITICAL_THRESHOLD=0.1
WARNING_THRESHOLD=0.3

if awk "BEGIN {exit !($BALANCE < $CRITICAL_THRESHOLD)}"; then
    echo -e "${RED}🚨 CRITICAL: Balance below ${CRITICAL_THRESHOLD} SOL!${NC}"
    echo -e "${RED}🚨 REFILL IMMEDIATELY to prevent service disruption${NC}"
    echo ""
    echo "Refill command:"
    echo "$SOLANA_BIN transfer $RELAYER_ADDRESS 1 --url $RPC_URL"
    exit 2
elif awk "BEGIN {exit !($BALANCE < $WARNING_THRESHOLD)}"; then
    echo -e "${YELLOW}⚠️  WARNING: Balance below ${WARNING_THRESHOLD} SOL${NC}"
    echo -e "${YELLOW}⚠️  Consider refilling soon${NC}"
    echo ""
    echo "Refill command:"
    echo "$SOLANA_BIN transfer $RELAYER_ADDRESS 1 --url $RPC_URL"
    exit 1
else
    echo -e "${GREEN}✅ Balance is healthy${NC}"
    exit 0
fi
