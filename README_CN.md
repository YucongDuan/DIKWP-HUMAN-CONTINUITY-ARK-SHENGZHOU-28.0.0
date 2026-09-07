# DIKWP HUMAN CONTINUITY ARK / SHENGZHOU 28.0.0（生舟）

> 面向AGI时代功能失效的个人与家庭生存连续性系统。

## 核心命题

生舟不预测某一天会不会出现“AGI末日”。它把普通人真正能观察、准备和演练的风险拆成八类失效世界：收入骤降、AI欺诈与冒用、网络与身份锁死、云和支付中断、基本服务中断、自主Agent或系统控制事故、局部安全失效与临时迁移、复合型连续性危机。

系统首先保护十二项不可相互抵消的底线：物资、健康、住所、通信、身份、财务、数字、信息、AI权限、迁移、社区、心理连续性。钱多不能抵消药物中断，云备份不能抵消账户接管，信息很多也不能抵消无法辨别真假。

## 一分钟开始

1. 下载并打开 `release/SHENGZHOU_Personal_AGI_Continuity_Client_28.0.0.html`。
2. 载入合成示例或填写自己的非敏感状态。
3. 查看最弱底线和最弱世界。
4. 完成优先级最高的六项行动。
5. 打印家庭紧急卡，执行一次通信或身份恢复演练。
6. 每月导出一次 `.hcpkg.json` 个人连续性包。

客户端完全离线，不需要账户、服务器、数据库或模型API。不要把密码、验证码、私钥、完整证件号、真实家庭暗号或未脱敏医疗记录输入客户端。

## 四个时间尺度

- **0–10分钟**：停止不可逆操作；确认人身安全；不要因一条消息转账、迁移、服药或授权。
- **10–60分钟**：通过已知号码回拨；启用第二通信渠道；保护设备、账户、证件和证据。
- **1–72小时**：保障水、食物、药物、电力、现金、照护和会合路线；进入本地连续性模式。
- **30–180天**：重建收入、技能、住处、公共服务、社会关系和可迁移身份。

## AI权限防火墙

系统固定：

```text
Capability != Authority
Access != Consent
Prediction != Fact
Urgency != Permission
External Automatic Action Authority = 0
```

AI可以在本地分析、整理、模拟和生成待审方案；涉及钱、合同、身份、医疗、法律、家门、迁移和外部联系的动作，必须由具名人类通过独立渠道确认。

## 运行命令

```bash
python run.py summary
python run.py demo --out outputs/demo
python run.py assess outputs/demo/shengzhou28-demo-state.json
python run.py build-package outputs/demo/shengzhou28-demo-state.json --out outputs/demo/my.hcpkg.json
python run.py verify-ledger outputs/demo/shengzhou28-demo.hcpkg.json
```

## 研究与现实边界

当前版本是Alpha级个人连续性工具和机构试点蓝图，不是应急服务、医疗器械、金融产品、预警系统、法律意见或生存保证。真正紧急时，以当地官方预警、应急服务和专业人员指令为准。

## 许可证

社区核心采用 Apache-2.0。开源不等于免费定制、免费部署、无限支持或现实责任转移。
