import { Contract, ContractProvider, Address, Cell, beginCell, Dictionary, Builder, SendMode, Sender } from 'ton-core';

export type EventData = {
  title: string;
  description: string;
  date: number;
  location: string;
  organizer: string;
  maxParticipants: number;
};

export class EventStorageContract implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new EventStorageContract(address);
  }

  static createFromConfig(owner: Address, code: Cell) {
    const data = beginCell()
      .storeAddress(owner)
      .storeDict(null)
      .endCell();
    return new EventStorageContract(
      Address.parseFriendly(owner.toString()).address,
      { code, data }
    );
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      bounce: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getOwner(provider: ContractProvider) {
    const { stack } = await provider.get('get_owner', []);
    return stack.readAddress();
  }

  async getDataRegistry(provider: ContractProvider) {
    const { stack } = await provider.get('get_data_registry', []);
    return stack.readCell();
  }

  async sendStoreData(
    provider: ContractProvider,
    via: Sender,
    params: {
      id: string;
      data: EventData;
      value: bigint;
    }
  ) {
    const { id, data, value } = params;
    await provider.internal(via, {
      value,
      bounce: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(1, 32) // op: store_data
        .storeStringTail(id)
        .storeStringTail(data.title)
        .storeStringTail(data.description)
        .storeUint(data.date, 64)
        .storeStringTail(data.location)
        .storeStringTail(data.organizer)
        .storeUint(data.maxParticipants, 32)
        .endCell(),
    });
  }

  async sendUpdateData(
    provider: ContractProvider,
    via: Sender,
    params: {
      id: string;
      data: Partial<EventData>;
      value: bigint;
    }
  ) {
    const { id, data, value } = params;
    await provider.internal(via, {
      value,
      bounce: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(2, 32) // op: update_data
        .storeStringTail(id)
        .storeDict(Dictionary.empty())
        .store(storeEventDataUpdate(data))
        .endCell(),
    });
  }

  async sendDeleteData(
    provider: ContractProvider,
    via: Sender,
    params: {
      id: string;
      value: bigint;
    }
  ) {
    const { id, value } = params;
    await provider.internal(via, {
      value,
      bounce: true,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(3, 32) // op: delete_data
        .storeStringTail(id)
        .endCell(),
    });
  }
}

function storeEventDataUpdate(data: Partial<EventData>): (builder: Builder) => void {
  return (builder) => {
    const flags = beginCell();
    if (data.title !== undefined) flags.storeBit(1);
    if (data.description !== undefined) flags.storeBit(1);
    if (data.date !== undefined) flags.storeBit(1);
    if (data.location !== undefined) flags.storeBit(1);
    if (data.organizer !== undefined) flags.storeBit(1);
    if (data.maxParticipants !== undefined) flags.storeBit(1);
    builder.storeBuilder(flags);

    if (data.title !== undefined) builder.storeStringTail(data.title);
    if (data.description !== undefined) builder.storeStringTail(data.description);
    if (data.date !== undefined) builder.storeUint(data.date, 64);
    if (data.location !== undefined) builder.storeStringTail(data.location);
    if (data.organizer !== undefined) builder.storeStringTail(data.organizer);
    if (data.maxParticipants !== undefined) builder.storeUint(data.maxParticipants, 32);
  };
}
