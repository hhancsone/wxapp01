import os
import io
import base64
import torch
import torch.nn as nn
from torchvision import transforms, models
from flask import Flask, request, jsonify
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)

MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'resnet18_medicine_163cls.pth')

NUM_CLASSES = 163

# 正确的中文映射
class_names = [
    "艾叶", "阿胶", "白扁豆", "百部", "白矾", "百合", "白花蛇舌草",
    "白蔻", "白茅根", "白芍", "白头翁", "白术", "柏子仁", "巴戟天",
    "板蓝根", "半夏", "北沙参块", "北沙参条", "鳖甲", "苍术",
    "草果", "草蔻", "侧柏叶", "柴胡", "蝉蜕", "陈皮", "沉香",
    "赤芍", "赤石脂", "虫草", "穿山甲", "穿心莲", "磁石",
    "大腹皮", "党参", "丹参", "大青叶", "大血藤", "地骨皮", "地龙",
    "地榆", "杜仲", "防风", "佛手", "茯苓", "覆盆子", "附子",
    "甘草", "干姜", "葛根", "枸杞子", "钩藤", "贯众", "谷芽",
    "合欢皮", "何首乌", "红花", "红蔻", "厚朴", "槐花", "黄柏",
    "黄精", "黄芩", "火麻仁", "虎杖", "僵蚕", "姜黄", "鸡内金",
    "荆芥", "金钱草", "金银花", "鸡血藤", "决明子", "苦参", "莱菔子",
    "连翘", "莲子心", "灵芝", "荔枝核", "龙骨", "路路通", "罗汉果",
    "络石藤", "麦冬", "麦芽", "墨旱莲", "牡丹皮", "牡蛎", "木香",
    "牛膝", "女贞子", "炮姜", "佩兰", "蒲公英", "蒲黄", "羌活",
    "前胡", "青蒿", "全蝎", "人参", "人参切片", "肉苁蓉根", "肉苁蓉片",
    "肉豆蔻", "肉桂", "桑螵蛸", "桑葚", "三七", "山药", "山楂",
    "山茱萸", "砂仁", "蛇床子", "射干", "升麻", "神曲", "石菖蒲",
    "石膏", "石斛", "首乌藤块", "首乌藤片", "水红花子", "水牛角", "酸枣仁",
    "桃仁", "天冬", "天葵子", "天麻块", "天麻片", "天南星", "通草",
    "土鳖虫", "菟丝子", "五加皮", "五灵脂", "乌梅", "五味子", "夏枯草",
    "香附", "仙鹤草", "小茴香", "辛夷", "细辛", "续断", "野菊花",
    "益母草", "茵陈", "薏苡仁", "远志", "郁金", "玉竹片", "玉竹条",
    "泽兰", "浙贝母", "珍珠母", "知母", "枳壳片", "枳壳条", "枳实",
    "竹茹", "紫草", "紫花地丁", "紫苑"
]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)

try:
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    if 'model_state_dict' in checkpoint:
        state_dict = checkpoint['model_state_dict']
    else:
        state_dict = checkpoint
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    print(f"模型加载成功: {MODEL_PATH}")
    print(f"设备: {device}")
except Exception as e:
    print(f"模型加载失败: {e}")
    model = None

transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def decode_base64_image(base64_str):
    try:
        image_data = base64.b64decode(base64_str)
        image = Image.open(io.BytesIO(image_data))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return image
    except Exception as e:
        return None

@app.route('/api/identify', methods=['POST'])
def identify():
    if model is None:
        return jsonify({'error': '模型未加载'}), 500

    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': '请提供base64图片'}), 400

    image = decode_base64_image(data['image'])
    if image is None:
        return jsonify({'error': '图片解析失败'}), 400

    try:
        img_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            top5_prob, top5_idx = torch.topk(probabilities, 5)

        results = []
        for i in range(5):
            idx = top5_idx[i].item()
            prob = top5_prob[i].item()
            results.append({
                'name': class_names[idx] if idx < len(class_names) else f'药材{idx}',
                'confidence': round(prob * 100, 2)
            })

        return jsonify({
            'success': True,
            'result': results
        })

    except Exception as e:
        return jsonify({'error': f'识别失败: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': model is not None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
