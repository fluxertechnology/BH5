class TcgClass {
  private url: string;
  private merchant_code: string;
  private desKey: string;
  private signKey: string;
  private currency: string;
  /**
   * 共用参数区
   */
  constructor() {
    this.url = "http://localhost/doBusiness.do"; // API 连接
    this.merchant_code = ""; // 代理商号
    this.desKey = ""; // 加密金钥
    this.signKey = ""; // 加密签名档
    this.currency = ""; // 币别
  }
  /**
   * 2.1. CREATE/REGISTER PLAYER API 创建/确认玩家接口
   * @param {string} username 会员名称
   * @param {string} password 会员密码
   * @return {Promise<any>}
   */
  async createUser(username: string, password: string): Promise<any> {
    const registerParams = {
      username: username,
      currency: this.currency,
      method: "cm",
      password: password,
    };
    const result = await this.sendRequire(registerParams);
    return result;
  }

  /**
   * 2.2. UPDATE PASSWORD API 更新密码接口
   * @param {string} username 会员名称
   * @param {string} password 会员密码
   * @return {Promise<any>}
   */
  async updatePassword(username: string, password: string): Promise<any> {
    const registerParams = {
      username: username,
      currency: this.currency,
      method: "up",
      password: password,
    };
    const result = await this.sendRequire(registerParams);
    return result;
  }

  /**
   * 2.3. GET BALANCE API 获取余额接口
   * @param {string} username 会员名称
   * @param {string} product_type 产品代码
   * @return {Promise<any>}
   */
  async getBalance(username: string, product_type: string): Promise<any> {
    const getBalanceParams = {
      username: username,
      method: "gb",
      product_type: product_type,
    };
    const result = await this.sendRequire(getBalanceParams);
    return result;
  }

  /**
   * 2.4. FUND TRANSFER API 资金转账接口
   * @param {string} username 会员名称
   * @param {string} product_type 产品代码
   * @param {number} fund_type 值1=转入到 值2=转出
   * @param {number} amount 金额
   * @param {string} reference_no 交易代码
   * @return {Promise<any>}
   */
  async userTransfer(
    username: string,
    product_type: string,
    fund_type: number,
    amount: number,
    reference_no: string,
  ): Promise<any> {
    const transferParams = {
      username: username,
      method: "ft",
      product_type: product_type,
      fund_type: fund_type,
      amount: amount,
      reference_no: reference_no,
    };
    const result = await this.sendRequire(transferParams);
    return result;
  }

  /**
   * 2.5. CHECK TRANSACTION STATUS API 检查交易状态接口
   * @param {string} product_type 产品代码
   * @param {string} reference_no 交易代码
   * @return {Promise<any>}
   */
  async checkTransfer(
    product_type: string,
    reference_no: string,
  ): Promise<any> {
    const checkParams = {
      method: "cs",
      product_type: product_type,
      ref_no: reference_no,
    };
    const result = await this.sendRequire(checkParams);
    return result;
  }

  /**
   * 2.6. LAUNCH GAME API 启动游戏接口 - 电子游戏
   * @param {string} username 会员名称
   * @param {string} product_type 产品代码
   * @param {number} game_mode 值1=正式 值0=测试
   * @param {string} game_code 游戏编码
   * @param {string} platform 平台
   * @return {Promise<any>}
   */
  async getLaunchGameRng(
    username: string,
    product_type: string,
    game_mode: number,
    game_code: string,
    platform: string,
  ): Promise<any> {
    const launchParams = {
      username: username,
      method: "lg",
      product_type: product_type,
      game_mode: game_mode,
      game_code: game_code,
      platform: platform,
    };
    const result = await this.sendRequire(launchParams);
    return result;
  }

  /**
   * 2.6. LAUNCH GAME API 启动游戏接口 - 彩票游戏
   * @param {string} username 会员名称
   * @param {string} product_type 彩票代码为 2
   * @param {number} game_mode 值1=正式 值0=测试
   * @param {string} game_code 游戏编码
   * @param {string} platform 平台 flash，html5
   * @param {string} view 平台
   * @return {Promise<any>}
   */
  async getLaunchGameLottery(
    username: string,
    product_type: string,
    game_mode: number,
    game_code: string,
    platform: string,
    view: string,
  ): Promise<any> {
    const lottery_bet_mode = "Traditional"; // 模式 目前只能使用 Traditional 传统及 Traditional_Mobile 传统_移动两种模式
    const series = [
      {
        game_group_code: "SSC",
        prize_mode_id: 1,
        max_series: 1956,
        min_series: 1700,
        max_bet_series: 1950,
        default_series: 1800,
      },
    ];
    const launchParams = {
      username: username,
      method: "lg",
      product_type: product_type,
      game_code: game_code,
      game_mode: game_mode,
      platform: platform,
      lottery_bet_mode: lottery_bet_mode,
      view: view,
      series: series,
    };
    const result = await this.sendRequire(launchParams);
    return result;
  }

  /**
   * 2.7. GAME LIST API 游戏列表接口
   * @param {string} product_type 产品代码
   * @param {string} platform 平台 - flash or html5 or all
   * @param {string} client_type 终端设备 - pc:电脑客户端, phone:手机客户端, web:网页浏览器, html5:手机浏览器
   * @param {string} game_type 游戏类型 - RNG, LIVE, PVP
   * @param {number} page 第几页 - 如果没有值默认为 page = 1
   * @param {number} page_size 每页显示几笔
   * @return {Promise<any>}
   */
  async getGameList(
    product_type: string,
    platform: string,
    client_type: string,
    game_type: string,
    page: number,
    page_size: number,
  ): Promise<any> {
    const gameListParams = {
      method: "tgl",
      product_type: product_type,
      platform: platform,
      client_type: client_type,
      game_type: game_type,
      page: page,
      page_size: page_size,
    };
    const result = await this.sendRequire(gameListParams);
    return result;
  }

  /**
   * 2.8. Player Game Rank API 玩家游戏排名接口
   * @param {string} product_type 产品代码
   * @param {string} game_category RNG，LIVE 这是必需的，仅在产品类型不是 1 和 2 和 5 时使用
   * @param {string} game_code T2KSSC、SD11X5、P00001
   * @param {string} start_date 开始日期 2016-01-01 00:00:00
   * @param {string} end_date 结束日期 2016-01-01 00:00:00
   * @param {number} count 最大行数
   * @return {Promise<any>}
   */
  async getGameRank(
    product_type: string,
    game_category: string,
    game_code: string,
    start_date: string,
    end_date: string,
    count: number,
  ): Promise<any> {
    const rankParams = {
      method: "pgr",
      product_type: product_type,
      game_category: game_category,
      game_code: game_code,
      start_date: start_date,
      end_date: end_date,
      count: count,
    };
    const result = await this.sendRequire(rankParams);
    return result;
  }

  /**
   * 3.1. GET RNG BET DETAILS 获得电子游戏及真人投注详情接口
   * @param {string} batch_name 批次号
   * @param {number} page 第几页
   * @return {Promise<any>}
   */
  async getBetDetails(batch_name: string, page: number): Promise<any> {
    const betDetailsParams = {
      method: "bd",
      batch_name: batch_name,
      page: page,
    };
    const result = await this.sendRequire(betDetailsParams);
    return result;
  }

  /**
   * 3.2. GET RNG BET DETAILS BY MEMBER 获得玩家电子游戏及真人投注详情接口
   * @param {string} username 会员名称
   * @param {string} start_date 开始时间
   * @param {string} end_date 结束时间
   * @return {Promise<any>}
   */
  async getBetDetailsMember(
    username: string,
    start_date: string,
    end_date: string,
    page: number,
  ): Promise<any> {
    const betDetailsParams = {
      username: username,
      method: "bdm",
      start_date: start_date,
      end_date: end_date,
      page: page,
    };
    const result = await this.sendRequire(betDetailsParams);
    return result;
  }

  /**
   * 4.1. GET LOTTO TRANSACTIONS BY MEMBER 取得会员的实时彩票交易记录
   * @param {string} username 会员名称
   * @param {string} start_date 开始时间
   * @param {string} end_date 结束时间
   * @return {Promise<any>}
   */
  async getLottoTxByMember(
    username: string,
    start_date: string,
    end_date: string,
    page: number,
  ): Promise<any> {
    const lottoTxParams = {
      username: username,
      method: "lmb",
      start_date: start_date,
      end_date: end_date,
      page: page,
    };
    const result = await this.sendRequire(lottoTxParams);
    return result;
  }

  /**
   * 基本上都是大同小异的写法, 如有任何问题请洽 TCG技术群 .... 抱歉小编懒的写了！
   */
  async getLottoCode(): Promise<any> {
    const lottoParams = {
      method: "glgl",
    };
    const result = await this.sendRequire(lottoParams);
    return result;
  }

  /**
   * Kick Out Lotto Member API 踢出彩票单个玩家接口
   **/
  async kickOutLottoMember(username: string): Promise<any> {
    const kickOutParams = {
      username: username,
      method: "kom",
    };
    const result = await this.sendRequire(kickOutParams);
    return result;
  }

  /**
   * Fund Transfer Out All API 转出玩家所有余额接口
   **/
  async fundTransferOutAll(
    username: string,
    product_type: string,
    fund_type: number,
    reference_no: string,
  ): Promise<any> {
    const transferOutAllParams = {
      username: username,
      method: "ftoa",
      product_type: product_type,
      fund_type: fund_type,
      reference_no: reference_no,
    };
    const result = await this.sendRequire(transferOutAllParams);
    return result;
  }

  /**
   * TCG Live API TCG直播接口
   **/
  async getLiveModelInfo(merchant_code: string): Promise<any> {
    const liveModelParams = {
      method: "gml",
      merchant_code: merchant_code,
    };
    const result = await this.sendRequire(liveModelParams);
    return result;
  }

  /**
   * 公用发送请求
   * @param {Object} sendParams
   * @return {Promise<any>}
   */
  async sendRequire(sendParams: object): Promise<any> {
    const params = this.encryptText(JSON.stringify(sendParams), this.desKey);
    const sign = this.hash("sha256", params + this.signKey);
    const data = {
      merchant_code: this.merchant_code,
      params: params,
      sign: sign,
    };
    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data as any), // Type assertion for URLSearchParams
    });
    const result = await response.text();
    console.log(result); // For debugging purposes
    const isHTMLResult = result.includes("<html");
    if (isHTMLResult) {
      console.error("Received HTML response instead of JSON");
      throw new Error("Invalid response from server");
    }
    return result;
  }

  /**
   * 组建 Params 加密参數
   * @param {string} plainText
   * @param {string} key
   * @return {string}
   */
  encryptText(plainText: string, key: string): string {
    const padded = this.pkcs5Pad(plainText, 8);
    const encText = this.opensslEncrypt(padded, "des-ecb", key);
    return btoa(encText); // Base64 encode
  }

  /**
   * 组建 Params 解密参數
   * @param {string} encryptText
   * @param {string} key
   * @return {string}
   */
  decryptText(encryptText: string, key: string): string {
    const cipherText = atob(encryptText); // Base64 decode
    const res = this.opensslDecrypt(cipherText, "des-ecb", key);
    return this.pkcs5Unpad(res);
  }

  /**
   * 填充
   * @param {string} text
   * @param {number} blocksize
   * @return {string}
   */
  pkcs5Pad(text: string, blocksize: number): string {
    const pad = blocksize - (text.length % blocksize);
    return text + String.fromCharCode(pad).repeat(pad);
  }

  /**
   * 去除填充
   * @param {string} text
   * @return {string}
   */
  pkcs5Unpad(text: string): string {
    const pad = text.charCodeAt(text.length - 1);
    if (pad > text.length) return "";
    if (
      text
        .slice(-pad)
        .split("")
        .every((char) => char.charCodeAt(0) === pad)
    ) {
      return text.slice(0, -pad);
    }
    return "";
  }

  /**
   * 计算签名
   * @param {string} algorithm
   * @param {string} data
   * @return {string}
   */
  hash(algorithm: string, data: string): string {
    // Implement hashing logic here
    // This is a placeholder; you may need to use a library like crypto-js
    return ""; // Return the hash
  }

  /**
   * 计算签名
   * @param {string} algorithm
   * @param {string} data
   * @return {string}
   */
  opensslEncrypt(data: string, method: string, key: string): string {
    // Implement OpenSSL encryption logic here
    return ""; // Return the encrypted data
  }

  /**
   * 计算签名
   * @param {string} algorithm
   * @param {string} data
   * @return {string}
   */
  opensslDecrypt(data: string, method: string, key: string): string {
    // Implement OpenSSL decryption logic here
    return ""; // Return the decrypted data
  }
}

export const tcg = new TcgClass();
