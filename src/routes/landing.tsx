import { useRef } from "react"
import { Link } from "react-router-dom"

export default function Landing() {

  const eduRef = useRef<HTMLDivElement | null>(null)
  const arteRef = useRef<HTMLDivElement | null>(null)
  const eventosRef = useRef<HTMLDivElement | null>(null)

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    if (!ref.current) return

    const container = ref.current

    const card = container.querySelector(".service-card") as HTMLElement
    if (!card) return

    const cardWidth = card.offsetWidth

    const style = window.getComputedStyle(container)
    const gap = parseInt(style.gap || "16")

    const scrollAmount = cardWidth + gap

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  const educacion = [
    { id: 1, titulo: "Clases de matemáticas", precio: "$20/h", imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b" },
    { id: 2, titulo: "Clases de física", precio: "$25/h", imagen: "https://images.unsplash.com/photo-1532094349884-543bc11b234d" },
    { id: 3, titulo: "Clases de inglés", precio: "$18/h", imagen: "https://images.unsplash.com/photo-1523240795612-9a054b0db644" },
    { id: 4, titulo: "Clases de programación", precio: "$30/h", imagen: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4" },
    { id: 5, titulo: "Clases de historia", precio: "$15/h", imagen: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" },
  ];

  const arte = [
    { id: 1, titulo: "Clases de dibujo", precio: "$20/h", imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f" },
    { id: 2, titulo: "Clases de pintura", precio: "$25/h", imagen: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    { id: 3, titulo: "Diseño gráfico básico", precio: "$18/h", imagen: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0" },
    { id: 4, titulo: "Ilustración digital", precio: "$30/h", imagen: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28" },
    { id: 5, titulo: "Clases de fotografía", precio: "$22/h", imagen: "https://images.unsplash.com/photo-1492724441997-5dc865305da7" },
  ];

  const eventos = [
    { id: 1, titulo: "Organización de fiestas", precio: "$50/h", imagen: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30" },
    { id: 2, titulo: "DJ para eventos", precio: "$60/h", imagen: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819" },
    { id: 3, titulo: "Decoración de eventos", precio: "$40/h", imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3" },
    { id: 4, titulo: "Animador infantil", precio: "$35/h", imagen: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9" },
    { id: 5, titulo: "Catering para eventos", precio: "$80/h", imagen: "https://images.unsplash.com/photo-1555244162-803834f70033" },
  ];

  return (
    <div className="landing">

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Busca y encuentra <span>servicios</span> en tu ciudad
          </h1>
          <p>
            Conéctate con nuestros proveedores de servicios de tu ciudad y encuentra lo que necesitas
            de manera rápida y sencilla. Servicios como enseñanza o arte, tenemos 
            todo lo que necesitas en un solo lugar.
          </p>
            <p>
                <Link to="/registro">¿Quieres ser un proveedor de servicios? </Link>
            </p>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Person working"
          />
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="categories">
        <h2>Explora nuestros servicios por categoría</h2>

        <div className="categories-grid">

          <div
            className="category-card"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b)` }}
          >
            <div className="overlay">
                <span>Educación</span>
            </div>
          </div>

          <div 
          className="category-card"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1513364776144-60967b0f800f)` }}
          >
            <div className="overlay">
              <span>Arte y Diseño</span>
            </div>
          </div>

          <div 
          className="category-card"
            style={{ backgroundImage: `url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9)` }}
          >
            <div className="overlay">
              <span>Eventos</span>
            </div>
          </div>

        </div>
      </section>
      
      <section className="recommended">
        <h2>Servicios recomendados</h2>

        {/* EDUCACIÓN */}
        <div className="service-category">
            <h3>Educación</h3>

            <div className="service-wrapper">
             <button onClick={() => scroll(eduRef, "left")} className="scroll-btn left">‹</button>
              <div className="services-grid" ref={eduRef}>
              {educacion.map((edu) => (
                <div className="service-card" key={edu.id}>
                    <img src={edu.imagen} alt={edu.titulo} />

                    <div className="service-info">
                    <h4>{edu.titulo}</h4>
                    <p>Clases personalizadas</p>

                    <div className="service-footer">
                        <span className="price">{edu.precio}</span>
                        <button><Link to="/login">Reservar</Link></button>
                    </div>
                    </div>
                </div> 
                ))}
              </div>

             <button onClick={() => scroll(eduRef, "right")} className="scroll-btn right">›</button>
            </div>
        </div>

        {/* ARTE */}
        <div className="service-category">
            <h3>Arte y Diseño</h3>

            <div className="service-wrapper">
             <button className="scroll-btn left" onClick={() => scroll(arteRef, "left")}>‹</button>
              <div className="services-grid" ref={arteRef}>
              {arte.map((art) => (
                <div className="service-card" key={art.id}>
                    <img src={art.imagen} alt={art.titulo} />

                    <div className="service-info">
                    <h4>{art.titulo}</h4>
                    <p>Explora tu creatividad</p>

                    <div className="service-footer">
                        <span className="price">{art.precio}</span>
                        <button><Link to="/login">Reservar</Link></button>
                    </div>
                    </div>
                </div> 
                ))}
              </div>
             <button className="scroll-btn right" onClick={() => scroll(arteRef, "right")}>›</button>
            </div>

        </div>

        {/* EVENTOS */}
        <div className="service-category">
            <h3>Eventos</h3>
            <div className="service-wrapper">
             <button className="scroll-btn left" onClick={() => scroll(eventosRef, "left")}>‹</button>

              <div className="services-grid" ref={eventosRef} >
              {eventos.map((evento) => (
                <div className="service-card" key={evento.id}>
                    <img src={evento.imagen} alt={evento.titulo} />

                    <div className="service-info">
                    <h4>{evento.titulo}</h4>
                    <p>Eventos inolvidables</p>

                    <div className="service-footer">
                        <span className="price">{evento.precio}</span>
                        <button><Link to="/login">Reservar</Link></button>
                        
                    </div>
                    </div>
                </div> 
                ))}
              </div>
              <button className="scroll-btn right" onClick={() => scroll(eventosRef, "right")}>›</button>
            </div>
        </div>

      </section>
    </div>
  )
}