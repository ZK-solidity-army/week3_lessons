# 3 week solidity bootcamp

## Usage

* `npm install`

### Deploy MyToken.sol

```bash
npx ts-node ./scripts/MyToken/deploy.ts
```

### Mint with MyToken.sol

```bash
npx ts-node ./scripts/MyToken/mint.ts \
    --address=0xa1e.. --to=0xcd2.. --amount=10
```

To mint for the deployer address you may ommit `--to`
```bash
npx ts-node ./scripts/MyToken/mint.ts --address=0xa1e.. --amount=10
```

### Delegate with MyToken.sol

```bash
npx ts-node ./scripts/MyToken/delegate.ts --address=0xa1e.. --to=0xcd2..
```

To delegate for itself you may ommit `--to`
```bash
npx ts-node ./scripts/MyToken/delegate.ts --address=0xa1e..
```

### Deploy TokenizedBallot.sol

```bash
npx ts-node ./scripts/TokenizedBallot/deploy.ts \
	--address=0xfed.. --block=1 --proposals==Chocollate,Vanilla,Strawberry
```

### Vote with TokenizedBallot.sol

```bash
npx ts-node /TokenizedBallot/vote.ts \
  --address=0xa1e.. --proposal=Chocollate --amount=2
```
