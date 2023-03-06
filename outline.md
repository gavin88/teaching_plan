# WEB中实现音频实时通信
在浏览器中实现实时音频通话，除了WEBRTC的另一种实现。

## 音视基础知识介绍
### 什么是PCM
PCM 即脉冲编码调制 (Pulse Code Modulation)。在PCM 过程中，将输入的模拟信号进行采样、量化和编码，用二进制进行编码的数来代表模拟信号的幅度；接收端再将这些编码还原为原来的模拟信号。即数字音频的 A/D 转换包括三个过程 ：采样，量化，编码。 
### 音频采样概率
采样定理是E.T.Whittaker(1915)、Kotelnikov(1933)、Shannon(1948)提出的，在数字信号处理领域中，采样定理是连续时间信号（通常称为“模拟信号”）和离散时间信号（通常称为“数字信号”）之间的基本桥梁。该定理说明采样频率与信号频谱之间的关系，是连续信号离散化的基本依据。 它为采样率建立了一个足够的条件，该采样率允许离散采样序列从有限带宽的连续时间信号中捕获所有信息。
### 采样率与采集声音频率的关系
在进行模拟/数字信号的转换过程中，当采样频率fs.max大于信号中最高频率fmax的2倍时(fs.max>2fmax)，采样之后的数字信号完整地保留了原始信号中的信息，一般实际应用中保证采样频率为信号最高频率的2.56～4倍；采样定理又称奈奎斯特定理
### opus音频编码介绍
#### 什么是音频编码
opus是一种有损的声音编码格式，音频编码是对音频采样数据的一种压缩算法。
#### opus编码的特点
低码率的情况下有较好的音质表现，适用于实时通信的场景。
#### 音频主要参数介绍
##### 采样率
##### 声道
##### 采样位宽
#### 音频混音如何实现
##### 

#### 音频重采样
##### 什么是音频混叠
##### 音频重采样的主要步骤
 - 基音与泛音
 - 变速不变调


## 技术选型
 - socket.io
 - rtp/rtcp协议介绍
 - JavaScript

## 在WEB中实现实时音频通信的优缺点
由于TCP拥塞算法的问题，导致在实时通信中TCP有着天然的劣势。但是对于WEB环境，如果我们不用WEBRTC那么我们就只能通过websocket实现通信（TCP）。那就得谈谈它的优缺点。
### 优点
 - 报文有序
 - 报文不会丢包
  
### 缺点
 - 队头阻塞（在多路复用中有着天然的劣势）

## jitterbuffer
在voice over IP(VoIP)中，抖动缓冲器是一个共享的数据区域，在这个数据区域中，每隔一段均匀的间隔，语音包会被收集，存储并发到语音处理器。包到达时间的变化，称作抖动，将会由于网络拥塞，定时漂移或路由变更而产生。抖动缓冲器放于语音连接的接收端，它有意地延迟到达的包，如此一来，终端用户就会感受到一个清晰的，没有什么声音失真的连接。抖动缓冲器有两种，静态的和动态的。
### 什么是网络抖动
抖动是为了表达网络发生拥塞，延迟的变化。
- jitterbuffer如何处理网络抖动
 - 固定缓冲
 - 自适应缓冲

## 回声消除
 - 回声形成和影响
 - 概述回声消除原理
 - webrtc回声消除模块使用介绍

## 噪声消除
 - 噪声消除基本原理
 - webrtc噪声消除模块使用介绍

## 动态增益
 - 声音分贝计算
 - 动态增益基本原理
 - webrtc动态增益模块使用介绍

## 如何实现延迟控制
 - 如何实现低延迟缓冲
 - 什么时候加减速播放

## 如何通过RTCP协议控制音频码率
目前音频的码率已经很低，这个在音频中似乎没啥必要了。

## WEB实时语音总体软件架构介绍
 - 音频采集播放
 - jitterbuffer实现
 - 音频编解码
 - 音频重采样
 - 回声消除实现
 - 音频混音

## WEB实时语音服务端实现
- 基础信令实现
- 音频数据转发实现

## 如何接入其他音视频服务器
- 如何通过ffmepg将音频数据转发到srs服务器实现对外直播



