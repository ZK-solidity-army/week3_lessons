# 3 week solidity bootcamp

## Usage

* `npm install`

### Deploy MyToken.sol

```bash
npx ts-node ./scripts/MyToken/deploy.ts
```

### Mint with MyToken.sol

```bash
npx ts-node ./scripts/MyToken/mint.ts --address=0xa1e.. --amount=10
```

You may mint for the specific account with `--to` option
```bash
npx ts-node ./scripts/MyToken/mint.ts \
    --address=0xa1e.. --to=0xcd2.. --amount=10
```

### Delegate with MyToken.sol

```bash
npx ts-node ./scripts/MyToken/delegate.ts --address=0xa1e..
```

You can delegate to specific account with `--to` option
```bash
npx ts-node ./scripts/MyToken/delegate.ts --address=0xa1e.. --to=0xcd2..
```

### Deploy TokenizedBallot.sol

```bash
npx ts-node ./scripts/TokenizedBallot/deploy.ts \
	--address=0xfed.. --block=1 --proposals=Chocollate,Vanilla,Strawberry
```

### Vote with TokenizedBallot.sol

```bash
npx ts-node ./scripts/TokenizedBallot/vote.ts \
  --address=0xa1e.. --proposal=Chocollate --amount=2
```

### GetAllProposals for TokenizedBallot.sol

```bash
npx ts-node ./scripts/TokenizedBallot/getAllProposals.ts --address=0xa1e..
```
