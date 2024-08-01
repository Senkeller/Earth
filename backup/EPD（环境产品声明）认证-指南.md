![JOE](https://github.com/user-attachments/assets/751d86df-ced6-4f49-8e37-0cfb1dc5f958)
国际EPD主页 https://www.environdec.com/home
> 环境产品认证EPD（Environmental Product Declaration，也叫做Ⅲ型环境产品声明）是经由第三方验证的，科学的、可比的、国际认可的，对产品整个生命周期的环境影响综合信息披露。


ISO 14020系列标准：EPD 的类型定义，原则和一般要求
ISO 14025, Ill型 EPD规定了基本原则、定义和要求，涵盖了EPD的编制过程、数据收集和验证、环境性能指标的选择和报告等方面
ISO 14040/14044, LCA 原则和框架/要求和指南规定生命周期评价的方法和原则，包括目标和范围的确定、生命周期清单、影响评估等方面。
EN15804，PCR,建筑产品类别针对建筑产品，按照LCA的理论分析，列出影响清单，并规定了相关数据的收集和计算方法
ISO 14067 温室气体-产品碳足迹-量化要求和指南规定了碳足迹的计算方法和指南。

建材的PCR标准是EN 15804

## LCA主要内容

> 1、计算的功能单位，一般以1kg/1m2/1m3等
> 2、使用的数据库（Econinvent）和LCA软件（simapro 9）
> 3、系统边界（生命周期阶段模型）
> 4、关键假设和限制，报告假设没有再回收（D阶段），因为是直接通过焚烧发电了
> 5、生命周期清单，（原材料消耗、运输、加工、产品运输、寿命终止的影响等）
> 6、潜在环境影响LCIA（建议的影响指标和推荐评估方法）

![image](https://github.com/user-attachments/assets/54cbcafe-892f-45f5-b64b-f2abaf0af65b)






PCR 分区：PCR 2012:01 Construction Products and Construction Services Version 2.31 (2019-12-20) 
1. 企业申请前提供产品相关信息
2. 查找或创建相关的产品类别规则PCR
3. 在PCR的基础上进行LCA研究和建模
4. 企业根据环境信息准备EPD报告
5. 根据企业环境信息对EPD报告进行核查
6. 第一阶段核查
7. 第二阶段核查
8. EPD平台核查与等级，发布 有效期5年
9. 年度监管 （第 2-3-4年）适用时变更
10. 再认证

![image](https://github.com/user-attachments/assets/c6309039-755e-4904-b2f3-e95e84b98163)


# 1、企业申请前提供产品相关信息

# 查找或创建相关的产品类别规则PCR
每份EPD都依托相应的PCR，PCR是一套用于产品环保声明开发的特定的规则、要求和指南，以符合等效的功能。PCR产品类别规则规定：应该收集哪些信息、这些信息应该如何评估，以及怎样在环保声明里面体现。若不存在相应的PCR，则需要开发相应的PCR。现有的12种产品类别共有154份已有的和正在开发的PCR。

# 2、在PCR的基础上进行LCA研究和建模
    进行EPD认证需从生命周期角度描述产品的环境影响，再单独写一份LCA报告。
对产品生命周期评估时，将产品的全生命周期（摇篮到坟墓）分为
![image](https://github.com/user-attachments/assets/a83ca5fc-56dc-494f-a837-c74b8dc101ab)


> A1-A3(原材料生产、原材料运输、产品制造)、A1 原料
> A4-A5（运输到施工场地、场内施工）、
> B1-B5（产品使用、维护、修理、替换、翻新）、
> B6-B7（能源使用、水资源使用)、
> C1-C4（拆除、运输至废物处理厂、再利用处理、处置）
> D（回收效益）这6个阶段。



| **A1** | **A2**   | **A3** | **A4**  | **A5** |  |   |
|:------:|:--------:|:------:|:-------:|:------:|:----:|:-----:|
| 原材料生产  | 原材料运输    | 产品制造   | 运输到施工场地 | 场内施工   |      |       |
| B1     | B2       | B3     | B4      | B5     | B6   | B7    |
| 产品使用   | 维护       | 修理     | 替换      | 翻新     | 能源使用 | 水资源使用 |
| C1     | C2       | C3     | C4      |        |      |       |
| 拆除     | 运输至废物处理厂 | 再利用处理  | 处置      |        |      |       |
| D      |          |        |         |        |      |       |
| 回收效益   |          |        |         |        |      |       |

C3-EU中，国内焚烧收益73.3%（2015年调查）

| **Impact category **                 | **影响类别**      | ** 单位** | **A1** | **A2** | **A3** | **A4** | **C** | **D** | **** |
|:------------------------------------:|:-------------:|:-------:|:------:|:------:|:------:|:------:|:-----:|:-----:|:----:|
| **Abiotic depletion**                | 非生物资源枯竭       |         |        |        |        |        |       |       |      |
| **Abiotic depletion (fossil fuels)** | 非生物资源枯竭（化石燃料） |         |        |        |        |        |       |       |      |
| **Global warming (GWP100a)**         | 全球变暖（GWP100a） |         |        |        |        |        |       |       |      |
| **Ozone layer depletion (ODP)**      | 臭氧层消耗（ODP）    |         |        |        |        |        |       |       |      |
| **Human toxicity**                   | 人体毒性          |         |        |        |        |        |       |       |      |
| **Fresh water aquatic ecotox**       | 淡水水生生态毒性      |         |        |        |        |        |       |       |      |
| **Marine aquatic ecotoxicity**       | 海洋水生生态毒性      |         |        |        |        |        |       |       |      |
| **Terrestrial ecotoxicity**          | 陆地生态毒性        |         |        |        |        |        |       |       |      |
| **Photochemic al oxidation**         | 光化学氧化         |         |        |        |        |        |       |       |      |
| **Acidification**                    | 酸化作用          |         |        |        |        |        |       |       |      |
| **Eutrophication**                   | 富营养化          |         |        |        |        |        |       |       |      |


**6个阶段中必须考虑到的阶段是A1-A3阶段**（**新版EN15804(《Ⅲ型环境声明》)需考虑A1-A3、C1-C4、D**），其他阶段可以根据产品使用特点选择性考虑。
**如B阶段是运营、维护阶段，若评估的产品不涉及运营维护阶段，那么B阶段就可以不考虑**。
**A1~A3阶段包括生产该产品的所有材料、能源、制造过程，也包括所有材料运输到工厂大门的运输过程以及该阶段产生的废弃物处置**（waste processing up to the end-of-waste state），**D阶段不再重复计算**。
报告一开始便是对产品的性能，外观进行描述，以及我们在计算时用到的软件、数据库来源等。


接下来便是LCA报告的主要内容，包括评估时选取的环境指标，计算结果以及结果分析。
在结果展示和分析时，我们可以利用图表使结果更清晰，更好的表达所评估产品的环境性能。

# 3、企业根据环境信息准备EPD报告
在这一步骤中，将生命周期评估结果以及PCR中要求的其他产品信息用国际EPD®系统要求的格式编写EPD。EPD应符合以下要求：符合ISO14020《环境标签和声明—一般原则》的要求和准则；内容是可验证的，准确的，相关的，而不是具有误导性的；不得出现与其他产品比较的内容，也不得包括产品的评级情况。

# 4、根据企业环境信息对EPD报告进行核查
验证过程必须由经批准的个人验证机构或经认可的认证机构进行，在验证前，需要提前联系验证机构的验证专家，在协商完验证费之后，验证专家就可以根据一般方案说明和有效的PCR，验证基于LCA的数据、附加环境信息以及EPD中提供的其他信息。

# 5、第一阶段核查
# 6、第二阶段核查
# 7、EPD平台核查与等级，发布 有效期5年
在验证完成后，便可在EPD官网中注册和提交一些强制性的文件，整个EPD认证完成后，依据`ISO 14025(《环境标志和声明 Ⅲ型环境声明 原则和程序》`)进行编制的，EPD证书有效期为3年，若在建筑行业，以`ISO 21930（《建筑施工的可持续性 建筑制品的环境声明》）和EN 15804` 为标准，其EPD证书有效期为5年。证书无需每年更新，但需每年缴纳会员费。

# 8、年度监管 （第 2-3-4年）适用时变更
# 9、再认证

# PCR: EN 15804：2012
Construction products and construction services (EN 15804:A1) (expired)`建筑产品和建筑服务（EN 15804：A1）（已过期）`
Full name：PCR 2012:01 Construction products and construction services (EN 15804:A1) (expired) (2.34) `PCR 2012：01建筑产品和建筑服务（EN 15804：A1）（已过期）（2.34）`
Prepared by：IVL Swedish Environmental Research Institute, Secretariat of the International EPD System `IVL瑞典环境研究所，国际环保署系统秘书处`
CPC Name: This PCR refers to the old version of the standard EN 15804 (EN 15804:2012+A1:2013). A new version was published 2019-12-20 (PCR 2019:14), referring to the new version of EN 15804 (EN 15804:2012+A2:2019). `此PCR是指标准EN 15804（EN 15804：2012 + A1：2013）的旧版本。新版本发布于 2019-12-20 （PCR 2019：14），参考了 EN 15804 （EN 15804：2012+A2：2019） 的新版本。`

The validity period of PCR 2012:01 ended 2022-02-28. As of 2022-03-01, PCR 2019:14 is the only valid main PCR for construction products in the International EPD System. `PCR 2012：01的有效期于2022-02-28结束。截至 2022-03-01，PCR 2019：14 是国际 EPD 系统中唯一有效的建筑产品主要 PCR。`

The below listed sub-PCRs are no longer valid, instead the c-PCRs under PCR 2019:14 shall be used. `下面列出的子PCR不再有效，而是使用PCR 2019：14下的c-PCR。`

This document serves as Product Category Rules (PCR) for Construction products and Construction services. It aims to be the main way to develop and register EPDs in the International EPD System, compliant with the European standard EN 15804:2012+A1:2013 (Sustainability of construction works - Environmental product declarations - Core rules for the product category of construction products). `本文档用作建筑产品和建筑服务的产品类别规则 （PCR）。它旨在成为在国际环保署体系中开发和注册环保署的主要途径，符合欧洲标准EN 15804：2012+A1：2013（建筑工程的可持续性 - 环境产品声明 - 建筑产品类别的核心规则）。`

In addition, this document may also be the basis for development of "sub-PCRs" for more specific product categories `此外，本文件还可以作为针对更具体产品类别开发“子PCR”的基础`

- If this document is used as a PCR, it may be used for Construction products and construction services for an EPD based on a declared unit, cradle-to-gate or cradle-to-gate with options; `如果此文件用作 PCR，则可用于基于声明单元、摇篮到大门或摇篮到大门的 EPD 的建筑产品和建筑服务，并提供选项;`
- If this document is used together with a sub-PCR, it may be used for an EPD based on a functional unit, cradle-to-grave. `如果将本文档与子PCR一起使用，则可用于基于功能单元（从摇篮到坟墓）的EPD。`

国内代理机构：
![image](https://github.com/user-attachments/assets/6880a266-18b1-4e79-9094-e7ef0fee424c)
![image](https://github.com/user-attachments/assets/7d7a3a43-fa7d-4062-be9f-fa6a09169ae0)



