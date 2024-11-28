import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from 'ton-core';

export type ProposalConfig = {
  id: string;
  title: string;
  description: string;
  author: Address;
  deadline: number;
  minVotingPower: bigint;
  quorum: bigint;
};

export type Vote = {
  voter: Address;
  support: boolean;
  power: bigint;
};

export function proposalConfigToCell(config: ProposalConfig): Cell {
  return beginCell()
    .storeUint(0, 1) // Simple version
    .storeAddress(config.author)
    .storeUint(config.deadline, 32)
    .storeCoins(config.minVotingPower)
    .storeCoins(config.quorum)
    .storeRef(
      beginCell()
        .storeStringTail(config.id)
        .storeStringTail(config.title)
        .storeStringTail(config.description)
        .endCell()
    )
    .endCell();
}

export class ProposalContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromConfig(config: ProposalConfig, code: Cell, workchain = 0) {
    const data = proposalConfigToCell(config);
    const init = { code, data };
    return new ProposalContract(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendVote(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      support: boolean;
      votingPower: bigint;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // op "Vote"
        .storeBit(opts.support)
        .storeCoins(opts.votingPower)
        .endCell(),
    });
  }

  async getVotes(provider: ContractProvider): Promise<{
    votesFor: bigint;
    votesAgainst: bigint;
    quorum: bigint;
  }> {
    const { stack } = await provider.get('get_votes', []);
    return {
      votesFor: stack.readBigNumber(),
      votesAgainst: stack.readBigNumber(),
      quorum: stack.readBigNumber(),
    };
  }

  async getStatus(provider: ContractProvider): Promise<{
    status: 'active' | 'passed' | 'rejected' | 'expired';
    deadline: number;
  }> {
    const { stack } = await provider.get('get_status', []);
    const statusNum = stack.readNumber();
    const deadline = stack.readNumber();

    const status = {
      0: 'active',
      1: 'passed',
      2: 'rejected',
      3: 'expired',
    }[statusNum] as 'active' | 'passed' | 'rejected' | 'expired';

    return {
      status,
      deadline,
    };
  }
}
