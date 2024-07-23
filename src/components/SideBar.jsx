import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

function Starter() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      {/* A placeholder which basically tells the parent route,where to render the child route. */}
      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          &copy; CopyRight {new Date().getFullYear()} by WorldWise Inc.
        </p>
      </footer>
    </div>
  );
}

export default Starter;
