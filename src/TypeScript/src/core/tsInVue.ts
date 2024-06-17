// vue-property-decorator 基于 vue-class-component
// 提供了多个装饰器和一个函数

// import { Component, Vue } from "vue-property-decorator";
// import { componentA, componentB } from "@/components";
// @Component({
//   components: {
//     componentA,
//     componentB,
//   },
//   directives: {
//     focus: {
//       //
//       inserted: function (el) {
//         el.focus();
//       },
//     },
//   },
// })
// export default class YourCompoent extends Vue {}

// 取消了组件的data和methods属性，以及data返回对象的属性，methods方法需要直接定义在class中
// 当做类的属性和方法
// @Component
// export default class HelloDecorator extends Vue {
//   count: number = 123; // 类属性相当于之前的data
//   add(): number {
//     // 类方法就是methods里的方法
//     this.count + 1;
//   }
//   // 获取计算属性
//   get total(): number {
//     return this.count + 1;
//   }
//   // 设置计算属性
//   set total(param: number): void {
//     this.count = param;
//   }
// }

// props
// import {Component,Vue,Prop} from vue-property-decorator;
// @Component
// export default class YourComponent extends Vue {
//  @Prop(String)
//  propA:string;
//  @Prop([String,Number])
//  propB:string|number;
//  @Prop({
//  type: String, // type: [String , Number]
//  default: 'default value', // String Number
//  //
//  // defatult: () => {
//  // return ['a','b']
//  // }
//  required: true,
//  validator: (value) => {
//  return [
//  'InProcess',
//  'Settled'
//  ].indexOf(value) !== -1
//  }
//  })
//  propC:string;
// }

// 监听器
// import { Vue, Component, Watch } from "vue-property-decorator";
// @Component
// export default class YourComponent extends Vue {
//   @Watch("child")
//   onChildChanged(val: string, oldVal: string) {}
//   @Watch("person", { immediate: true, deep: true })
//   onPersonChanged1(val: Person, oldVal: Person) {}
//   @Watch("person")
//   onPersonChanged2(val: Person, oldVal: Person) {}
// }

// emit
// import { Vue, Component, Emit } from "vue-property-decorator";
// @Component({})
// export default class Some extends Vue {
//   mounted() {
//     this.$on("emit-todo", function (n) {
//       console.log(n);
//     });
//     this.emitTodo("world");
//   }
//   @Emit()
//   emitTodo(n: string) {
//     console.log("hello");
//   }
// }
