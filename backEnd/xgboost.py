import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
import xgboost as xgb

# Load dataset (replace with your actual file path)
df = pd.read_csv(r'd:\HousingData.csv')

# Preprocessing: Encoding categorical features
categorical_cols = ['Posted On', 'Floor', 'Area Type', 'Area Locality', 'City', 
                    'Furnishing Status', 'Tenant Preferred', 'Point of Contact']
label_encoders = {}

# Label encoding for categorical columns
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))  # Handle missing/mixed types
    label_encoders[col] = le

# Features and Target
X = df.drop('Rent', axis=1)  # Features (independent variables)
y = df['Rent']  # Target (dependent variable)

# Split data into training and testing sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize XGBoost model (with some basic parameters)
model = xgb.XGBRegressor(
    n_estimators=100,          # Number of trees in the forest
    random_state=42,           # For reproducibility
    objective='reg:squarederror',  # Squared error for regression
    learning_rate=0.05,        # Control overfitting
    max_depth=6                # Limit depth of trees
)

# Fit the model to the training data
model.fit(X_train, y_train)

# Predict on the test set
y_pred = model.predict(X_test)

# Calculate Mean Squared Error (MSE) on the test set
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error on test set: {mse:.2f}")

# ---- TEST DATA ----
# Example of test data for prediction (replace with actual input values)
test_data = pd.DataFrame([{
    'Posted On': 0,             # Example value
    'BHK': 2,                   # Example value
    'Size': 1278,               # Example value
    'Floor': 1,                 # Example value
    'Area Type': 1,             # Example value
    'Area Locality': 50,        # Bhagyanagar
    'City': 2,                  # Belgaum
    'Furnishing Status': 1,     # Example value
    'Tenant Preferred': 1,      # Family
    'Bathroom': 2,              # Example value
    'Point of Contact': 5       # Example value
}])

# Predict the rent for the provided test data using the trained XGBoost model
predicted_rent = model.predict(test_data)[0]
print(f"Predicted Rent for the test data: {predicted_rent:.2f}")