## 类的保护和私有属性

```ts
class Demo {
  private name: string;
  protected age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
class Student extends Demo {
  private time: number;
  constructor(name: string, age: number, time: number) {
    super(name, age);
    this.time = time;
  }
}

const d = new Demo("js", 10);
d.name; // error private
d.age; // error protected
```

# ts 属性快捷操作

```ts
// 1. pick
interface Zw {
  name: string;
  age: number;
  location: string;
}
type Zw1 = Pick<Zw, "age" | "location">;

const d: Zw1 = {
  age: 10,
  location: "wh",
};

// 2. omit
type Zw2 = Omit<Zw, "locaiton">;
const p: Zw2 = {
  age: 10,
  name: "xxx",
};

// 3. partial 部分属性
type Zw3 = Partial<Zw>
const q: Zw3 = {
  age: 10,
  name: "xxx",
};
```

# ts只读
```ts
interface Zw {
    readonly name: string;
    age: number;
}
```