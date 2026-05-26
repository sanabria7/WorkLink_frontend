import "../../styles/landing.css"
import "../../App.css"
import Imagen1 from "../../assets/landing-imagen/Img-1.png"
import ImgCardEducation from "../../assets/landing-imagen/Card-education.png"
import ImgCardArte from "../../assets/landing-imagen/Card-arte.png"
import ImgCardEvento from "../../assets/landing-imagen/Card-evento.png"
import ImgProveedorInfo from "../../assets/landing-imagen/ImgProveedorInfo.png"
import ContainerServiceCard from "../landing/ContainerServiceCard"
import ContainerProviders from "../landing/ContainerProviders"
export default function LandingPage() {

    return (
        <div className="landing-page">

            <div className="horizontal-rule">
            </div>
            <div className="app">
                <div className="hero">
                    <div className="container">
                        <div className="container2">
                            <div className="container3">
                                <div className="user-verified">
                                    <img className="vector-icon4" alt="" />

                                </div>
                                <div className="contamos-con-la">Contamos con la confianza de +500 usuarios</div>
                            </div>
                            <div className="heading-1">
                                <div className="busca-y-encuentra-container">
                                    <span>Busca y encuentra </span>
                                    <span className="servicios">Servicios </span>
                                    <span>en tu ciudad</span>
                                </div>
                            </div>
                            <div className="paragraph">
                                <div className="connect-with-the">Conéctate con los mejores proveedores independientes de tu ciudad destacados en Educación, Arte & Diseño, y Organización de Eventos y reserva sus servicios en nuestra plataforma de manera flexible y segura.</div>
                            </div>
                            <div className="container4">
                                <div className="button-component5" id="buttonComponentContainer">
                                    <div className="span">
                                        <div className="qu-ests-esperando">Explora nuestros servicios</div>
                                    </div>
                                </div>
                                <div className="button-component6" id="buttonComponentContainer1">
                                    <div className="span">
                                        <div className="qu-ests-esperando">¿Quieres ser proveedor?</div>
                                    </div>
                                </div>
                            </div>
                            <div className="container5">
                                <div className="container6">
                                    <div className="container7">
                                        <b className="b">90%</b>
                                    </div>
                                    <div className="container8">
                                        <div className="satisfaccin-al-cliente">Satisfacción al cliente</div>
                                    </div>
                                </div>
                                <div className="container6">
                                    <div className="container7">
                                        <b className="b">95%</b>
                                    </div>
                                    <div className="container8">
                                        <div className="satisfaccin-al-cliente">Servicios completados</div>
                                    </div>
                                </div>
                                <div className="container6">
                                    <div className="container7">
                                        <b className="b">2K+</b>
                                    </div>
                                    <div className="container8">
                                        <div className="satisfaccin-al-cliente">Proveedores Activos</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container15">
                            <img className="img-1-icon" alt="" src={Imagen1}/>

                            <div className="container16">
                                <div className="container17">
                                    <div className="container18">
                                        <div className="user-verified">
                                            <img className="vector-icon" alt="" />

                                        </div>
                                    </div>
                                    <div className="container19">
                                        <div className="container20">
                                            <div className="reserva">Reserva</div>
                                        </div>
                                        <div className="container21">
                                            <div className="aprobada">Aprobada!</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container22">
                                <div className="container23">
                                    <div className="container18">
                                        <div className="user-verified">
                                            <img className="vector-icon6" alt="" />

                                        </div>
                                    </div>
                                    <div className="container25">
                                        <div className="span">
                                            <div className="tienes-una-nueva">Tienes una nueva</div>
                                        </div>
                                        <div className="container27">
                                            <div className="aprobada">Solicitud de reserva</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container28">
                                <div className="container29">
                                    <div className="dnde-agregar-ubicacin-container">Crea, publica y reserva</div>
                                </div>
                                <div className="container30">
                                    <div className="servicios2">Servicios</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="categoryfilters" data-scroll-to="categoryFiltersContainer">
                    <div className="container31">
                        <div className="heading-2">
                            <div className="explora-nuestros-servicios">Explora nuestros servicios por categoría</div>
                        </div>
                        <div className="paragraph2">
                            <div className="discover-top-rated-services">Descubra los servicios mejor valorados en nuestras principales categorías.</div>
                        </div>
                    </div>
                    <div className="container32">
                        <div className="card" style={{backgroundImage: `url(${ImgCardEducation})`}}>
                            <div className="container33">
                                <div className="container34">
                                    <div className="heading-3">
                                        <div className="educacin">Educación</div>
                                    </div>
                                </div>
                                <div className="container35">
                                    <div className="button-component7">
                                        <div className="span">
                                            <div className="e">Ver más</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card2" style={{backgroundImage: `url(${ImgCardArte})`}}>
                            <div className="container33">
                                <div className="container37">
                                    <div className="heading-32">
                                        <div className="arte-y-diseo">Arte y Diseño</div>
                                    </div>
                                </div>
                                <div className="container38">
                                    <div className="button-component7">
                                        <div className="span">
                                            <div className="e">Ver más</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card2"  style={{backgroundImage: `url(${ImgCardEvento})`}}>
                            <div className="container33">
                                <div className="container34">
                                    <div className="heading-2">
                                        <div className="organizacin-de-eventos">Organización de Eventos</div>
                                    </div>
                                </div>
                                <div className="container38">
                                    <div className="button-component7">
                                        <div className="span">
                                            <div className="e">Ver más</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="featuredservices">
                    <div className="content7">
                        <div className="container42">
                            <div className="heading-22">
                                <div className="servicios-recomendados">Servicios recomendados</div>
                            </div>
                            <div className="paragraph3">
                                <div className="servicios-seleccionados-especi">Servicios seleccionados especialmente para ti </div>
                            </div>
                        </div>
                    </div>
                    <div className="content8">
                        <ContainerServiceCard categoria="Educacion"></ContainerServiceCard>
                        <ContainerServiceCard categoria="Arte"></ContainerServiceCard>
                        <ContainerServiceCard categoria="Eventos"></ContainerServiceCard>
                    </div>
                </div>
                <div className="providerinfo" data-scroll-to="providerInfoContainer">
                    <div className="content12">
                        <img className="content-icon" alt="" src={ImgProveedorInfo}/>

                        <div className="content13">
                            <div className="container139">
                                <div className="heading-23">
                                    <div className="te-gustara-ofrecer">¿Te gustaría ofrecer servicios como proveedor independiente?</div>
                                </div>
                                <div className="pharagrap">
                                    <div className="si-tienes-una">Si tienes una habilidad, conocimiento o talento que puedas ofrecer, puedes convertirte en proveedor y conectar con personas interesadas en lo que tú haces.</div>
                                </div>
                            </div>
                            <div className="container140">
                                <div className="content14">
                                    <div className="container141">
                                        <div className="audience">
                                            <img className="vector-icon43" alt="" />

                                        </div>
                                        <div className="content15">
                                            <div className="haz-crecer-tu">Haz crecer tu audiencia</div>
                                            <div className="publica-tu-servicio">Publica tu servicio y empieza a conectar con clientes interesados en lo que haces.</div>
                                        </div>
                                    </div>
                                    <div className="container141">
                                        <div className="boost">
                                            <img className="vector-icon44" alt="" />

                                        </div>
                                        <div className="content15">
                                            <div className="haz-crecer-tu">Impulsa tu perfil</div>
                                            <div className="publica-tu-servicio">Crea un perfil donde puedas mostrar tu experiencia, habilidades y genera confianza para futuros clientes.</div>
                                        </div>
                                    </div>
                                    <div className="container141">
                                        <div className="share-partner">
                                            <img className="vector-icon45" alt="" />

                                        </div>
                                        <div className="content15">
                                            <div className="haz-crecer-tu">Monetiza tu conocimiento</div>
                                            <div className="publica-tu-servicio">Convierte tus habilidades en ingresos. </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="container144">
                                <div className="qu-ests-esperando">¿Qué estás esperando?</div>
                                <div className="button-component46">
                                    <div className="span">
                                        <div className="qu-ests-esperando">Crea tu cuenta</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ContainerProviders></ContainerProviders>
                <div className="footer">
                    <div className="container199">
                        <div className="container200">
                            <div className="container201">
                                <img className="logo-icon2" alt="" />

                            </div>
                            <div className="paragraph24">
                                <div className="the-marketplace-for">El lugar que conecta clientes y proveedores informales, abarcando el sector de la Educación, el Arte & Diseño, y la Organización de Eventos</div>
                            </div>
                            <div className="container202">
                                <div className="link">
                                    <div className="e">E</div>
                                </div>
                                <div className="link">
                                    <div className="e">D</div>
                                </div>
                                <div className="link">
                                    <div className="e">C</div>
                                </div>
                                <div className="link">
                                    <div className="e">S</div>
                                </div>
                            </div>
                        </div>
                        <div className="container203">
                            <div className="heading-4">
                                <div className="enlaces-rpidos">Enlaces Rápidos</div>
                            </div>
                            <div className="list">
                                <div className="list-item">
                                    <div className="inicio">Inicio</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Acerca de nosotros</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Servicios</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Modo Proveedor</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Proveedores destacados</div>
                                </div>
                            </div>
                        </div>
                        <div className="container204">
                            <div className="heading-4">
                                <div className="enlaces-rpidos">Categorias</div>
                            </div>
                            <div className="list">
                                <div className="list-item">
                                    <div className="inicio">Educación</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Arte & Diseño</div>
                                </div>
                                <div className="list-item">
                                    <div className="inicio">Eventos</div>
                                </div>
                            </div>
                        </div>
                        <div className="container205">
                            <div className="heading-43">
                                <div className="enlaces-rpidos">Asistencia</div>
                            </div>
                            <div className="list3">
                                <div className="list-item9">
                                    <div className="icon16">
                                        <div className="mail">
                                            <img className="vector-icon54" alt="" />

                                        </div>
                                    </div>
                                    <div className="span">
                                        <div className="inicio">hello@worklink.org</div>
                                    </div>
                                </div>
                                <div className="list-item9">
                                    <div className="icon17">
                                        <div className="mail">
                                            <img className="vector-icon55" alt="" />

                                        </div>
                                    </div>
                                    <div className="span">
                                        <div className="inicio">+1 (555) 123-4567</div>
                                    </div>
                                </div>
                                <div className="list-item11">
                                    <div className="icon16">
                                        <div className="mail">
                                            <img className="vector-icon56" alt="" />

                                        </div>
                                    </div>
                                    <div className="text72">
                                        <div className="inicio">Guadalajara de Buga</div>
                                        <div className="inicio">123 Creative Ave, Suite 100</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container206">
                        <div className="heading-43">
                            <div className="tienes-una-nueva">© 2026 WorkLink Todos los derechos reservados</div>
                        </div>
                        <div className="container207">
                            <div className="link5">
                                <div className="apple">
                                    <img className="vector-icon57" alt="" />

                                </div>
                                <div className="tienes-una-nueva">Español (CO)</div>
                            </div>
                            <div className="link6">
                                <div className="tienes-una-nueva">Términos de Servicio</div>
                            </div>
                            <div className="link6">
                                <div className="tienes-una-nueva">Política de Cookies</div>
                            </div>
                            <div className="link8">
                                <div className="apple">
                                    <img className="union-icon" alt="" />

                                </div>
                            </div>
                            <div className="link8">
                                <div className="apple">
                                    <img className="vector-icon58" alt="" />

                                    <img className="vector-icon59" alt="" />

                                    <img className="vector-icon60" alt="" />

                                    <img className="vector-icon61" alt="" />

                                    <img className="vector-icon62" alt="" />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}