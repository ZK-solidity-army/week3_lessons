# 3 week solidity bootcamp

## Usage

### Deploy MyToken.sol

```bash
npx ts-node ./scripts/TokenizedBallot/MyTokenDeploy.ts
```

### Deploy TokenizedBallot.sol

```bash
npx ts-node /TokenizedBallot/TokenizedBallotDeploy.ts \
	--address=0xfed.. --block=1 --proposals==Chocollate,Vanilla,Strawberry
```

### Vote with Vote.sol

```bash
npx ts-node /TokenizedBallot/Vote.ts \
  --address=0xa1e.. --proposal=Chocollate --amount=100
```
