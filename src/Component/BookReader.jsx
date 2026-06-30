import { useParams, useNavigate } from "react-router-dom";
import { books } from "./booksData";

export default function BookReader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const book = books.find((b) => b.id === Number(id));

  if (!book) return <h2>Kitob topilmadi</h2>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-black text-white rounded"
      >
        ⬅ Orqaga
      </button>

      <img
        src={book.image}
        className="w-full h-80 object-cover rounded-xl mb-4"
      />

      <h1 className="text-2xl font-bold">{book.title}</h1>

      <p className="text-gray-500 mb-4">
        ✍ {book.author} | 📖 {book.category}
      </p>

      {/* 📖 KATTA HIKOYA MATNI */}
      <div className="bg-gray-100 p-5 rounded-xl whitespace-pre-line leading-7 text-[15px]">
        {book.story}
      </div>
    </div>
  );
}