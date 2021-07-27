import { DBAction } from "./neo4tsCore/core/entities/db.action";
import { ParamsHolder } from "./neo4tsCore/core/entities/paramsHolder";
import { findAll } from "./neo4tsCore/infrastructure/presenters";

describe('hello', () => {

	test('lol', () => {
		const action: DBAction = findAll({
			seller: {
				label: 'Seller',
				properties: {
					name: 'mr jhonson',
					description: {
						type: 'string',
						value: 'my name is',
						operator: "or",
						condition: 'starts'
					}
				}
			},
			product: {
				label: 'Product',
			},
			sellerToProd: {
				label: 'SELL_BY',
				from: 'product',
				to: 'seller',
			},
			customer: {
				label: 'Customer',
				isOptional: true,
				properties: {
					age: {
						type: 'number',
						value: 20,
						condition: 'greater equal'
					}
				}
			},
			sellTo: {
				label: 'SELL_TO',
				isOptional: true,
				from: 'seller',
				to: 'customer'
			}
		}, 3, 20);
		const params: ParamsHolder = action.getParamHolder();

		const expected: string = `MATCH (product:Product)-[sellerToProd:SELL_BY]->(seller:Seller) WHERE seller.name = ${params.getParamNameForQuery('seller', 'name')} `
		+ `OR toLower(seller.description) STARTS WITH toLower(${params.getParamNameForQuery('seller', 'description')}) `
		+ `OPTIONAL MATCH (seller)-[sellTo:SELL_TO]->(customer:Customer) WHERE customer.age >= ${params.getParamNameForQuery('customer', 'age')} RETURN seller, `
		+ `product, customer, sellerToProd, sellTo SKIP 60 LIMIT 20`;

		expect(action.getQuery()).toBe(expected);
	});

});