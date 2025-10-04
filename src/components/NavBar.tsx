import { useState, useEffect } from "react";
import ButtonNav from "./ButtonNav";
import { NavLink, useNavigate } from "react-router-dom";


function NavBar() {
    const buttons = [
        { name: "Profile", path:"/profile"},
        { name: "Schedule", path:"/schedule"},
        { name: "Team", path:"/team"}
    ];
    const [activeButton, setActiveButton] = useState(buttons[1]);

    const navigate = useNavigate();
    useEffect(() => {
        // Auto-redirect after mount
        navigate(activeButton.path);
    }, [navigate]);


    return (
        <div className="flex gap-2 justify-left">
            {buttons.map((button) => (
            <NavLink
                key={button.name}
                to={button.path}
            >
                <ButtonNav
                    text={button.name}
                    active={activeButton.name === button.name}
                    onClick={() => setActiveButton(button)}
                />
            </NavLink>
            ))}
        </div>
    );
}

export default NavBar
