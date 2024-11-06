// helius-tools.ts
import { 
  Helius,
  WebhookType,
  TransactionType,
  Collections,
  Address
} from "helius-sdk";
import {
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  Keypair
} from "@solana/web3.js";

export class HeliusTools {
  private helius: Helius;
  
  constructor(apiKey: string) {
    this.helius = new Helius(apiKey);
  }

  /**
   * DAS API 模块 - 资产相关操作
   */
  class DasAPI {
    // 获取单个资产信息
    async getAsset(assetId: string) {
      const response = await this.helius.rpc.getAsset({
        id: assetId,
        displayOptions: {
          showCollectionMetadata: true,
        }
      });
      return response;
    }

    // 批量获取资产信息
    async getAssetBatch(assetIds: string[]) {
      const response = await this.helius.rpc.getAssetBatch({
        ids: assetIds,
      });
      return response;
    }

    // 获取资产相关的交易签名
    async getSignaturesForAsset(assetId: string, page: number = 1) {
      const response = await this.helius.rpc.getSignaturesForAsset({
        id: assetId,
        page,
      });
      return response.items;
    }

    // 搜索资产
    async searchAssets(ownerAddress: string, compressed: boolean = true) {
      const response = await this.helius.rpc.searchAssets({
        ownerAddress,
        compressed,
        page: 1,
      });
      return response.items;
    }

    // 获取压缩资产的Merkle证明
    async getAssetProof(assetId: string) {
      const response = await this.helius.rpc.getAssetProof({
        id: assetId,
      });
      return response;
    }

    // 获取地址拥有的所有资产
    async getAssetsByOwner(ownerAddress: string) {
      const response = await this.helius.rpc.getAssetsByOwner({
        ownerAddress,
        page: 1,
      });
      return response.items;
    }

    // 获取同一组的资产列表
    async getAssetsByGroup(groupKey: string, groupValue: string) {
      const response = await this.helius.rpc.getAssetsByGroup({
        groupKey,
        groupValue,
        page: 1,
      });
      return response.items;
    }

    // 获取创建者的资产列表
    async getAssetsByCreator(creatorAddress: string, onlyVerified: boolean = true) {
      const response = await this.helius.rpc.getAssetsByCreator({
        creatorAddress,
        onlyVerified,
        page: 1,
      });
      return response.items;
    }

    // 获取特定权限的资产列表
    async getAssetsByAuthority(authorityAddress: string) {
      const response = await this.helius.rpc.getAssetsByAuthority({
        authorityAddress,
        page: 1,
      });
      return response.items;
    }
  }

  /**
   * NFT铸造模块
   */
  class MintAPI {
    // 铸造压缩NFT
    async mintCompressedNft(nftData: {
      name: string;
      symbol: string;
      owner: string;
      description: string;
      attributes: Array<{trait_type: string; value: string}>;
      imageUrl?: string;
      imagePath?: string;
      walletPrivatekey?: string;
      externalUrl?: string;
      sellerFeeBasisPoints?: number;
    }) {
      const response = await this.helius.mintCompressedNft(nftData);
      return response.result;
    }

    // 委托Collection权限
    async delegateCollectionAuthority(data: {
      collectionMint: string;
      updateAuthorityKeypair: Keypair;
    }) {
      await this.helius.delegateCollectionAuthority(data);
    }

    // 撤销Collection权限
    async revokeCollectionAuthority(data: {
      collectionMint: string;
      revokeAuthorityKeypair: Keypair;
    }) {
      await this.helius.revokeCollectionAuthority(data);
    }

    // 获取NFT系列的所有代币
    async getMintlist(collectionQuery: Collections) {
      return await this.helius.getMintlist({
        query: collectionQuery,
      });
    }
  }

  /**
   * Webhook模块 - 事件监听
   */
  class WebhookAPI {
    // 创建Webhook
    async createWebhook(data: {
      accountAddresses: string[];
      webhookURL: string;
      transactionTypes?: TransactionType[];
      webhookType?: WebhookType;
      authHeader?: string;
    }) {
      return await this.helius.createWebhook(data);
    }

    // 编辑Webhook
    async editWebhook(webhookId: string, data: any) {
      return await this.helius.editWebhook(webhookId, data);
    }

    // 添加监听地址
    async appendAddressesToWebhook(webhookId: string, addresses: string[]) {
      return await this.helius.appendAddressesToWebhook(webhookId, addresses);
    }

    // 移除监听地址
    async removeAddressesFromWebhook(webhookId: string, addresses: string[]) {
      return await this.helius.removeAddressesFromWebhook(webhookId, addresses);
    }

    // 删除Webhook
    async deleteWebhook(webhookId: string) {
      return await this.helius.deleteWebhook(webhookId);
    }

    // 获取所有Webhook
    async getAllWebhooks() {
      return await this.helius.getAllWebhooks();
    }

    // 获取特定Webhook
    async getWebhookByID(webhookId: string) {
      return await this.helius.getWebhookByID(webhookId);
    }

    // 创建Collection Webhook
    async createCollectionWebhook(data: {
      collectionQuery: Collections;
      webhookURL: string;
      transactionTypes: TransactionType[];
      webhookType: WebhookType;
    }) {
      return await this.helius.createCollectionWebhook(data);
    }
  }

  /**
   * 交易处理模块
   */
  class TransactionAPI {
    // 发送智能交易
    async sendSmartTransaction(
      instructions: TransactionInstruction[],
      signers: Keypair[],
      lookupTables: any[] = [],
      options: { skipPreflight?: boolean } = {}
    ) {
      return await this.helius.rpc.sendSmartTransaction(
        instructions,
        signers,
        lookupTables,
        options
      );
    }

    // 创建智能交易
    async createSmartTransaction(
      instructions: TransactionInstruction[],
      signers: Keypair[],
      lookupTables: any[] = [],
      feePayer?: PublicKey
    ) {
      return await this.helius.rpc.createSmartTransaction(
        instructions,
        signers,
        lookupTables,
        feePayer
      );
    }

    // 获取计算单元
    async getComputeUnits(
      instructions: TransactionInstruction[],
      payerKey: PublicKey,
      lookupTables: any[] = [],
      signers: Keypair[] = []
    ) {
      return await this.helius.rpc.getComputeUnits(
        instructions,
        payerKey,
        lookupTables,
        signers
      );
    }

    // 监控交易确认
    async pollTransactionConfirmation(signature: string) {
      return await this.helius.rpc.pollTransactionConfirmation(signature);
    }

    // 发送带小费的智能交易
    async sendSmartTransactionWithTip(
      instructions: TransactionInstruction[],
      signers: Keypair[],
      addressLut: any,
      tipAmount: number = 100000,
      location: string = "NY"
    ) {
      return await this.helius.rpc.sendSmartTransactionWithTip(
        instructions,
        signers,
        addressLut,
        tipAmount,
        location
      );
    }
  }

  /**
   * 辅助工具模块
   */
  class HelperAPI {
    // 获取当前TPS
    async getCurrentTPS() {
      return await this.helius.rpc.getCurrentTPS();
    }

    // 空投
    async airdrop(address: string, amount: number) {
      return await this.helius.rpc.airdrop(
        new PublicKey(address),
        amount
      );
    }

    // 获取质押账户
    async getStakeAccounts(address: string) {
      return await this.helius.rpc.getStakeAccounts(address);
    }

    // 获取代币持有者
    async getTokenHolders(mintAddress: string) {
      return await this.helius.rpc.getTokenHolders(mintAddress);
    }

    // 获取优先费用估算
    async getPriorityFeeEstimate(accountKeys: string[]) {
      return await this.helius.rpc.getPriorityFeeEstimate({
        accountKeys,
        options: {
          includeAllPriorityFeeLevels: true,
        }
      });
    }
  }
}

// ================= 使用示例 =================
const exampleUsage = async () => {
  const tools = new HeliusTools('YOUR_API_KEY');
  
  // 获取资产信息
  const asset = await tools.DasAPI.getAsset('ASSET_ID');
  
  // 创建webhook监听NFT交易
  await tools.WebhookAPI.createWebhook({
    accountAddresses: [Address.MAGIC_EDEN_V2],
    webhookURL: 'your-webhook-url',
    transactionTypes: [TransactionType.NFT_SALE],
    webhookType: WebhookType.DISCORD
  });
  
  // 铸造NFT
  const nft = await tools.MintAPI.mintCompressedNft({
    name: "My NFT",
    symbol: "MNFT",
    owner: "WALLET_ADDRESS",
    description: "My first NFT",
    attributes: [{
      trait_type: "Type",
      value: "Special"
    }],
    imageUrl: "IMAGE_URL"
  });
  
  // 获取当前TPS
  const tps = await tools.HelperAPI.getCurrentTPS();
};
