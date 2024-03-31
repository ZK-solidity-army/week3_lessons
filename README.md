# 3 week solidity bootcamp

## Usage

### Deploy MyToken.sol

```bash
npx ts-node ./scripts/MyToken/deploy.ts
```

### Deploy TokenizedBallot.sol

```bash
npx ts-node /TokenizedBallot/deploy.ts \
	--address=0xfed.. --block=1 --proposals==Chocollate,Vanilla,Strawberry
```

### Vote with Vote.sol

```bash
npx ts-node /TokenizedBallot/vote.ts \
  --address=0xa1e.. --proposal=Chocollate --amount=100
```
