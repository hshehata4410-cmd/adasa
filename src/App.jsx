import './App.css';
import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import PostDetails from './components/Home/PostDetails'; // جديد
import BlogPage from './components/Blogs/BlogPage'; // صفحة المدونة
import AboutPage from './components/About/AboutPage'; // صفحة من نحن
import NotFoundPage from './components/NotFoundPage'; // صفحة 404

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("UseEffect is running");
    axios.get("/Data/posts.json")
      .then((response) => {
        console.log("postsData",response.data.posts);
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.log("Error loading posts:", error);
      });
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl">الرئيسية</h1>
      <p className="mt-4">Number of posts: {posts.length}</p>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage /> 
      },
      { path: "blogs", element: <BlogPage /> },
      { path: "blogs/:slug", element: <PostDetails /> }, 
      { path: "about", element: <AboutPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;