import Footer from "../components/Footer";
import Header from "../components/Header";



export default function HomePage() {


    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 mx-auto">
                Hello
            </main>
            <Footer />
        </div>
    )
}