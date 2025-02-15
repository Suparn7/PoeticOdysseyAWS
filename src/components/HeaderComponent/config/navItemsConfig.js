import { faHome, faSignInAlt, faUserPlus, faUserCircle, faBell, faComments, faBookOpen, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const navItemsConfig = (authStatus) => [
    { name: "Home", slug: "/PoeticOdyssey", active: true, icon: faHome },
    { name: "Login", slug: "/PoeticOdyssey/login", active: !authStatus, icon: faSignInAlt },
    { name: "Signup", slug: "/PoeticOdyssey/signup", active: !authStatus, icon: faUserPlus },
    { name: "Add Post", slug: "/PoeticOdyssey/add-post", active: authStatus, icon: faPencilAlt },
    { name: "My Posts", slug: "/PoeticOdyssey/my-posts", active: authStatus, icon: faBookOpen },
    { name: "Profile", slug: "/PoeticOdyssey/profile", active: authStatus, icon: faUserCircle },
    { name: "Chats", slug: "/PoeticOdyssey/chat", active: authStatus, icon: faComments },
];

export default navItemsConfig;