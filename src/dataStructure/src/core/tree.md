## 二叉树

### 遍历

#### 前序遍历

```javascript
const preOrder = root => {
  if (!root) {
    return null;
  }
  console.log(root);
  preOrder(root.left);
  preOrder(root.right);
};
```
