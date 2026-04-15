import { BrowserRouter } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";

function AppRouter() {
    return (
        <BrowserRouter>
            <PublicRoutes />
        </BrowserRouter>
    );
}

export default AppRouter;