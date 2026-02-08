from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app) 

df = pd.read_csv('perfumeData.csv', encoding='ISO-8859-1')
df.drop_duplicates(inplace=True)
df.dropna(inplace=True)

# extract needed features
features = df['Name'] + ' ' + df['Brand'] + ' ' + df['Notes']
vectorizer = TfidfVectorizer()
feature_vectors = vectorizer.fit_transform(features.values.astype('U'))


@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        input_notes = request.args.get('notes', '')

        if not input_notes:
            return jsonify({"error": "Missing 'notes' parameter"}), 400

        input_vector = vectorizer.transform([input_notes])

        # similarity scores between the input and all perfumes
        similarity_scores = cosine_similarity(input_vector, feature_vectors)

        n = int(request.args.get('n', 5))  # default is 5 recommendations
        similar_indices = similarity_scores[0].argsort()[-n:][::-1]

        # get details of similar perfumes
        recommendations = df.iloc[similar_indices].to_dict(orient='records')

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)