import pytest
import json
from app import app, df, vectorizer, feature_vectors


@pytest.fixture
def client():
    """create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


class TestRecommendationEngine:
    """tests for the recommendation endpoint."""

    def test_recommend_returns_results(self, client):
        """test that recommendations are returned for valid input."""
        response = client.get('/recommend?notes=vanilla+musk')

        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 5  # default number of recommendations

    def test_recommend_custom_count(self, client):
        """test that n parameter controls number of results."""
        response = client.get('/recommend?notes=rose+jasmine&n=3')

        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) == 3

    def test_recommend_missing_notes_returns_error(self, client):
        """test that missing notes parameter returns 400 error."""
        response = client.get('/recommend')

        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert data['error'] == "Missing 'notes' parameter"

    def test_recommend_empty_notes_returns_error(self, client):
        """test that empty notes parameter returns 400 error."""
        response = client.get('/recommend?notes=')

        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data

    def test_recommend_returns_expected_fields(self, client):
        """test that recommendations contain required fields."""
        response = client.get('/recommend?notes=citrus&n=1')

        assert response.status_code == 200
        data = json.loads(response.data)
        assert len(data) > 0

        recommendation = data[0]
        assert 'Name' in recommendation
        assert 'Brand' in recommendation
        assert 'Notes' in recommendation

    def test_recommend_different_notes_different_results(self, client):
        """test that different notes produce different recommendations."""
        response1 = client.get('/recommend?notes=vanilla+amber&n=3')
        response2 = client.get('/recommend?notes=citrus+fresh&n=3')

        data1 = json.loads(response1.data)
        data2 = json.loads(response2.data)

        # get the names from each recommendation set
        names1 = {r['Name'] for r in data1}
        names2 = {r['Name'] for r in data2}

        # they should not be identical (different scent profiles)
        assert names1 != names2


class TestDataIntegrity:
    """tests for data loading and preprocessing."""

    def test_dataset_loaded(self):
        """test that the perfume dataset is loaded correctly."""
        assert df is not None
        assert len(df) > 0

    def test_dataset_has_required_columns(self):
        """test that the dataset has all required columns."""
        required_columns = ['Name', 'Brand', 'Notes']
        for col in required_columns:
            assert col in df.columns

    def test_no_duplicates_in_dataset(self):
        """test that duplicates were removed during preprocessing."""
        assert len(df) == len(df.drop_duplicates())

    def test_no_null_values(self):
        """test that null values were removed during preprocessing."""
        assert df.isnull().sum().sum() == 0

    def test_vectorizer_fitted(self):
        """test that the TF-IDF vectorizer is properly fitted."""
        assert vectorizer is not None
        assert hasattr(vectorizer, 'vocabulary_')

    def test_feature_vectors_shape(self):
        """test that feature vectors have correct dimensions."""
        assert feature_vectors.shape[0] == len(df)


class TestCORS:
    """tests for CORS configuration."""

    def test_cors_headers_present(self, client):
        """test that CORS headers are included in responses."""
        response = client.get('/recommend?notes=vanilla')

        # check for CORS header
        assert response.status_code == 200
