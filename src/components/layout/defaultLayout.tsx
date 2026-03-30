import { Outlet } from "react-router-dom";
import Header from "./header";

export default function DefaultLayout(){
    return (
        <>
            <Header></Header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </>
    );
}