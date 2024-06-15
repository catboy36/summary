// 接口
// 一系列抽象方法的声明，是一些方法特征的集合，这些方法都是抽象的，需要由具体的类去实习
// 描述对象相关的属性和方法，但是不提供具体创建此对象实例的方法

interface User {
  name: string;
  // 可选属性
  age?: number;
  readonly isMale: boolean;
  say: (words: string) => string;
  [propName: string]: any;
}
const getUserName = (user: User) => user.name;

// getUserName({ color: 'red' } as unknown as User);
getUserName({ color: 'red', name: 'liu', isMale: true, say: w => w });

// 接口继承
interface Father {
  color: String;
}
interface Mother {
  height: Number;
}
interface Son extends Father, Mother {
  name: string;
  age: Number;
}

// 应用
//
interface IUser {
  name: string;
  age: number;
}
const getUserInfo = (user: IUser): string => {
  return `name: ${user.name}, age: ${user.age}`;
};
//
getUserInfo({ name: 'koala', age: 18 });
