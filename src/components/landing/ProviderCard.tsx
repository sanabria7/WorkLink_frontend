import type { ProfileProveedor } from "../../types/userTypes"

interface ProviderCardProps{
    proveedor : ProfileProveedor;
}

export default function ProviderCard({proveedor} : ProviderCardProps) {
    return (
        <div className="container147">
            <div className="container148">
                <img className="profilephoto-icon" alt="" src="https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHBvcnRyYWl0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzYxNjQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />

                <div className="container149">
                    <div className="user-verified">
                        <img className="vector-icon" alt="" />

                    </div>
                </div>
            </div>
            <div className="heading-322">
                <div className="haz-crecer-tu">{proveedor.usuario.nombre + " " + proveedor.usuario.apellido}</div>
            </div>
            <div className="paragraph20">
                <div className="experienced-math-tutor">{proveedor.biografia}</div>
            </div>
            <div className="container150">
                <div className="container151">
                    <div className="container152">
                        <div className="text46">
                            <div className="div31">12</div>
                        </div>
                    </div>
                    <div className="container153">
                        <div className="container152">
                            <div className="rating">Servicios</div>
                        </div>
                    </div>
                </div>
                <div className="container154">
                    <div className="container155">
                        <div className="star-filled16">
                            <img className="vector-icon47" alt="" />

                        </div>
                        <div className="heading-23">
                            <div className="div">4.9</div>
                        </div>
                    </div>
                    <div className="container153">
                        <div className="container152">
                            <div className="rating">Rating</div>
                        </div>
                    </div>
                </div>
                <div className="container151">
                    <div className="container152">
                        <div className="text46">
                            <div className="div33">8</div>
                        </div>
                    </div>
                    <div className="container153">
                        <div className="container152">
                            <div className="rating">Años de experiencia</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-component47">
                <div className="span">
                    <div className="e">Ver perfil</div>
                </div>
            </div>
        </div>
    )
}