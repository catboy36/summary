## CDN
`Content Delivery Network`即为内容分发网络

构建在现有网络基础之上的智能虚拟网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡，内容分发，调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。

CDN的关键技术主要有内容存储和分发技术

简单来说，CDN就是根据用户位置分配最近的资源

用户访问最近的一个CDN节点，即”边缘节点“，就是缓存了源站内容的代理服务器

### 原理分析

应用CDN后，DNS返回的不再是IP地址，而是一个CNAME别名记录，指向CDN的全局负载均衡

CNAME实际上在域名解析的过程中承担了中间人（或者说代理）的角色，这是CDN实现的关键


#### 负载均衡系统
由于没有返回IP地址，于是本地DNS会向负载均衡系统再次发出请求，则进入到CDN的全局负载均衡系统进行智能调度：
* 看用户的IP地址，查表得知地理位置，找相对最近的边缘节点
* 看用户所在的运营商网络，找相同网络的边缘节点
* 检查边缘节点的负载情况，找负载较轻的节点
* 其它，比如节点的“健康状况”，服务能力，带宽，响应时间等

结合上面的因素，得到最合适的边缘节点，然后把这个节点返回给用户，用户就能够就近访问CDN的缓存代理

#### 缓存代理
缓存系统会有选择的缓存那些最常用的资源

两个衡量CDN服务质量的指标：
* 命中率：用户访问的资源恰好在缓存系统里，可以直接返回给用户，命中次数与所有访问次数之比
* 回源率：缓存里没有，必须用代理的方式回源站取，回源次数和所有访问次数之比

缓存系统也可以划分出层次，分成一级缓存节点和二级缓存节点，一级缓存配置高一些，直连源站，二级缓存配置低一些，直连用户

回源的时候耳机缓存只找一级缓存，一级缓存没有才回源站，可以有效的减少真正的回源


## 总结
CDN目的是为了改善互联网的服务质量，提高访问速度

负载均衡系统相当于CDN的大脑，缓存系统相当于CDN的心脏

