# 中草药百科与识别小程序

一个基于UniApp开发的中草药百科与识别小程序，集成了药材识别、百科查询、收藏管理等功能。

## 功能特性

### 🏠 首页
- 系统描述信息
- 快速导航到识别、百科、我的页面

### 📷 识别功能
- 上传图片识别药材
- 显示识别结果和匹配度
- 自动保存识别记录到云数据库
- 上传识别图片到云存储

### 📚 百科功能
- 药材分类浏览
- 药材详细信息查看
- 支持搜索功能

### 👤 个人中心
- 我的收藏：查看收藏的药材
- 识别记录：查看历史识别记录，显示上传的图片
- 关于我们：应用信息和版权声明

## 技术栈

### 前端
- **框架**：UniApp
- **语言**：Vue.js
- **UI组件**：自定义组件
- **状态管理**：uni-id-pages store

### 后端
- **云服务**：UniCloud（阿里云）
- **云函数**：云对象（yaocai、shoucang、shibie、fenlei）
- **数据库**：NoSQL数据库
- **图片存储**：云存储

### 识别服务
- **API服务**：Flask
- **模型**：ResNet18
- **部署**：本地服务器

## 项目结构

```
├── pages/              # 页面目录
│   ├── index/          # 首页
│   ├── identify/       # 识别页面
│   ├── encyclopedia/   # 百科页面
│   │   ├── detail.vue  # 药材详情
│   ├── mine/           # 个人中心
│       ├── collection.vue      # 收藏列表
│       ├── identify-records.vue # 识别记录
│       ├── about.vue           # 关于我们
├── uniCloud-aliyun/    # 云服务目录
│   ├── cloudfunctions/ # 云函数
│       ├── yaocai/     # 药材相关
│       ├── shoucang/   # 收藏相关
│       ├── shibie/     # 识别相关
│       ├── fenlei/     # 分类相关
│   ├── database/       # 数据库表结构
├── server/             # 识别API服务
│   ├── app.py          # Flask应用
│   ├── models/         # 模型文件
├── models/             # 识别模型
├── pages.json          # 页面配置
├── README.md           # 项目说明
```

## 安装说明

### 环境要求
- Node.js 14.0+
- HBuilderX 3.0+
- Python 3.7+（识别服务）

### 前端安装
1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/herb-encyclopedia.git
   ```

2. **打开项目**
   - 使用HBuilderX打开项目文件夹

3. **配置云服务**
   - 在HBuilderX中关联UniCloud服务空间
   - 上传部署云函数和数据库

4. **运行项目**
   - 选择运行环境（微信小程序开发者工具）
   - 编译运行

### 识别服务安装
1. **安装依赖**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **启动服务**
   ```bash
   python app.py
   ```
   服务默认运行在 http://localhost:5000

3. **配置API地址**
   - 修改 `pages/identify/identify.vue` 中的 `apiBaseUrl`

## 数据库结构

### 药材表（yaocai）
- `_id`：药材ID
- `name`：药材名称
- `latin_name`：拉丁学名
- `category`：分类
- `medicinal_part`：药用部位
- `taste`：性味
- `meridian`：归经
- `efficacy`：功效
- `indication`：主治
- `images`：图片

### 收藏表（shoucang）
- `_id`：收藏ID
- `user_id`：用户ID
- `user_nickname`：用户昵称
- `herb_id`：药材ID
- `herb_name`：药材名称
- `herb_image`：药材图片
- `create_date`：创建时间

### 识别记录表（shibie）
- `_id`：记录ID
- `herb_name`：药材名称
- `confidence`：匹配度
- `identify_time`：识别时间
- `user_id`：用户ID
- `user_nickname`：用户昵称
- `image_url`：识别图片URL

### 分类表（fenlei）
- `_id`：分类ID
- `name`：分类名称
- `description`：分类描述
- `sort`：排序

## 使用说明

### 识别功能
1. 点击底部导航栏的"识别"图标
2. 点击"上传图片"按钮
3. 选择相册或拍照
4. 等待识别结果
5. 查看识别结果和详细信息

### 百科功能
1. 点击底部导航栏的"百科"图标
2. 选择分类浏览药材
3. 点击药材卡片查看详情
4. 点击星星图标收藏药材

### 个人中心
1. 点击底部导航栏的"我的"图标
2. 查看个人信息
3. 点击"我的收藏"查看收藏的药材
4. 点击"识别记录"查看历史识别记录
5. 点击"关于我们"查看应用信息

## 开发命令

### 前端
- **运行**：HBuilderX 运行到小程序
- **构建**：HBuilderX 发行

### 后端
- **启动服务**：`python server/app.py`
- **查看日志**：控制台输出

## 注意事项

1. **识别服务**：需要先启动Flask服务才能使用识别功能
2. **云服务**：需要正确配置UniCloud服务空间
3. **权限**：需要小程序权限设置（相机、相册）
4. **性能**：识别功能依赖本地服务器性能

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

- 作者：黄文达
- 邮箱：your.email@example.com
- 项目地址：https://github.com/yourusername/herb-encyclopedia
