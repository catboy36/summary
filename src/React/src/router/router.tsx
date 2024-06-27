// react-router和router常用组件
// 路由的本质就是页面url发生改变时，页面的显示结果可以根据url的变化而变化，页面不刷新
// 路由可以实现单页面应用（SPA）

// 分为几个不同包
// react-router 实现了路由的核心功能
// react-router-dom 基于react-router，加入了在浏览器运行环境下的一些功能
// react-router-native 基于react-router,加入了react-native运行环境下的一些功能
// react-router-config: 用于配置静态路由的工具库

// react-router-dom常用组件
// 1. BrowserRouter，HashRouter
// Router中包含了对路径改变的监听，并且会将相应的路径传递给子组件
// BrowserRouter是history模式， HashRouter是Hash模式
// 两者作为最顶层组件包裹其他组件

// import { BrowserRouter as Router } from 'react-router-dom';
// export default function App() {
//   return (
//     <Router>
//       <main>
//         <nav>
//           <ul>
//             <li>
//               <a href=" ">Home</a>
//             </li>
//             <li>
//               <a href="/about">About</a>
//             </li>
//             <li>
//               <a href="/contact">Contact</a>
//             </li>
//           </ul>
//         </nav>
//       </main>
//     </Router>
//   );
// }

// 2. Route
// Route用于路径匹配，然后进行组件的渲染，属性如下：
// 1. path属性：用于设置匹配到的路径
// 2. component属性：设置匹配到路径后，渲染的组件
// 3. render属性：设置匹配到路径后，渲染的内容
// 4. exact属性：开启精准匹配，只有精准匹配到完全一致的路径，才会渲染对应的组件

import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
  useParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
export default function RouterApp() {
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
        {/* exact属性改为end */}
        <NavLink to="/" end style={{ color: 'red' }}>
          首页
        </NavLink>
        <NavLink to="/about" style={{ color: 'red' }}>
          关于
        </NavLink>
        <NavLink to="/profile" style={{ color: 'red' }}>
          我的
        </NavLink>
        <NavLink to="/detail?name=why&age=18">测试to传入对象</NavLink>
        <NavLink
          to={{
            pathname: '/detail',
            // state: { height: 1.98, address: ' ' },
            search: '?apikey=123',
          }}
        >
          测试to传入对象2
        </NavLink>
      </main>
      <Routes>
        <Route path="/" element={<h1>Welcome!</h1>} />
        <Route path="/about" Component={() => <h1>About</h1>} />
        <Route path="/profile" Component={() => <Navigate to="/about" />} />
        <Route
          path="/detail"
          Component={props => {
            // const [searchParams] = useSearchParams();
            // console.log(props, searchParams.get('name'));
            const location = useLocation();
            console.log(location);
            return <div>3333</div>;
          }}
        />
      </Routes>
    </Router>
  );
}

// 3. Link, NavLink
// 通常路径的跳转是使用Link组件，最终会被渲染成a元素，其中属性to代替a标签的href属性
// NavLink是在Link基础上增加了一些样式属性（新版激活时自带一个active样式）
// react-router6 移除 activeClassName和activeStyle
{
  /* <NavLink
  to="/messages"
- style={{ color: 'blue' }}
- activeStyle={{ color: 'green' }}
+ style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })}
>
  Messages
</NavLink> */
}

{
  /* <NavLink
  to="/messages"
- className="nav-link"
- activeClassName="activated"
+ className={({ isActive }) => "nav-link" + (isActive ? " activated" : "")}
>
  Messages
</NavLink> */
}

// 通过Route作为组件顶层包裹后，页面组件就可以接收到路由相关的东西，比如props.history
// history对象有goBack，goForward, push方法
// const Contact = ({ history }) => (
//   <Fragment>
//     <h1>Contact</h1>
//     <button onClick={() => history.push('/')}>Go to home</button>
//     <FakeText />
//   </Fragment>
// );

// 4. redirect
// 用于重定向，当这个组件出现时，就会执行跳转到对应的to路径中：

// import { redirect } from 'react-router-dom';

// const loader = async () => {
//   const user = await getUser();
//   if (!user) {
//     return redirect('/login');
//   }
//   return null;
// };

// react-router6 不使用Switch组件，改为Routes组件
// react-router6 不使用Redirect组件，改为Navigate组件

// 5. react-router提供hooks
// useLocation
// import * as React from 'react';
// import { useLocation } from 'react-router-dom';

// function App() {
// location对象
//   let location = useLocation();

//   React.useEffect(() => {
//     // Google Analytics
//     ga('send', 'pageview');
//   }, [location]);

//   return (
//     // ...
//   );
// }

// useParams
// 获取url的param
// import * as React from 'react';
// import { Routes, Route, useParams } from 'react-router-dom';

// function ProfilePage() {
//   // Get the userId param from the URL.
//   let { userId } = useParams();
//   // ...
// }

// function App() {
//   return (
//     <Routes>
//       <Route path="users">
//         <Route path=":userId" element={<ProfilePage />} />
//         <Route path="me" element={...} />
//       </Route>
//     </Routes>
//   );
// }

// useNavigate(老版本useHistory)
// 跳转
// import { useNavigate } from 'react-router-dom';

// function App() {
//   let navigate = useNavigate();
//   function handleClick() {
//     navigate('/home');
//   }
//   return (
//     <div>
//       <button onClick={handleClick}>go home</button>
//     </div>
//   );
// }

// 6.路由参数传递
// 1. 动态路由方式
// 2. search传递参数
// 3. to传入对象

// 动态路由
// <Route path="/detail/:id" component={Detail}/>
// 获取参数 useParams

// search传递参数
// 跳转的路径中添加了一些query参数
{
  /* <NavLink to="/detail2?name=why&age=18"> 2</NavLink> */
}
// 获取参数 useSearchParams

// to 传入对象
{
  /* <NavLink
  to={{
    pathname: '/detail2',
    query: { name: 'kobe', age: 30 },
    state: { height: 1.98, address: ' ' },
    search: '?apikey=123',
  }}
>
  2
</NavLink>; */
}
// 获取参数 useLocation
