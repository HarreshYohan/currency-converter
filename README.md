# currency converter 
# Used Technologies

1. Node JS
2. Typescript
3. Express framework
4. dotenv for manage environment variables
5. node-cache for caching

# Getting Started (for development)

## Linux / Mac OS / Windows

1. Checkout the code (git clone https://github.com/HarreshYohan/currency-converter.git)
2. Go to project root directory in terminal or CMD
3. npm install
4. npm run dev

## Run

npm run dev

## Build
 
npm run build

## Clean (remove previous build)

npm run clean

## API 

/convert — POST

Eg : body = {
	"fromCurrency": "LKR",
	"amount": 234.0,
	"toCurrency": "USD"
}
respose = {
	"amount": 1.20343267683,
	"currency": "USD"
}
