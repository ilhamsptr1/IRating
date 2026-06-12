const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const getAIRecommendations = async (ratings) => {
  if (!ratings || ratings.length === 0) {
    return {
      message: 'Mulai rating beberapa film terlebih dahulu agar saya bisa memberikan rekomendasi yang tepat untuk Anda!',
      recommendations: []
    };
  }

  const ratedMovies = ratings.map(r => `${r.title} (Rating: ${r.rating}/10)`).join(', ');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten rekomendasi film yang ahli. Berikan rekomendasi dalam format JSON array. Setiap item harus punya: "title" (judul film dalam bahasa Inggris), "year" (tahun rilis), "reason" (alasan rekomendasi dalam Bahasa Indonesia, 1-2 kalimat). Berikan tepat 6 rekomendasi film yang BERBEDA dari film yang sudah ditonton pengguna.'
          },
          {
            role: 'user',
            content: `Saya sudah menonton dan merating film-film ini: ${ratedMovies}. Tolong rekomendasikan 6 film lain yang mungkin saya suka berdasarkan preferensi saya. Balas dalam format JSON array saja tanpa teks lain.`
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return {
        message: 'Maaf, terjadi kesalahan saat mengambil rekomendasi. Coba lagi nanti.',
        recommendations: []
      };
    }

    const content = data.choices[0].message.content;
    let recommendations = [];
    
    try {
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
    }

    return {
      message: `Berdasarkan ${ratings.length} film yang sudah Anda tonton, berikut rekomendasi dari AI:`,
      recommendations
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      message: 'Gagal terhubung ke AI. Periksa koneksi internet Anda.',
      recommendations: []
    };
  }
};
