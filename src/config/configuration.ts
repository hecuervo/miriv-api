export default () => ({
	port: parseInt(process.env.PORT) || 3000,

	jwt: {
		secret: process.env.JWT_SECRET
	},

});
