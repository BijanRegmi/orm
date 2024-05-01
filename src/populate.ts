import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create `count` products each with 0-10 variants
 */
async function populateProduct(count: number) {
    for (let i = 0; i < count; i++) {
        const name = faker.commerce.productName();
        await prisma.product.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/\s/g, ""),
                description: faker.commerce.productDescription(),
                product_variant: {
                    createMany: {
                        data: Array.from({ length: Math.floor(Math.random() * 10) }).map(
                            (_, idx) => {
                                return {
                                    name: `${name}_${idx}`,
                                    sku: name.toUpperCase().replace(/\s/g, "") + `${idx}`,
                                    description: faker.commerce.productDescription(),
                                    price: faker.number.int({ min: 1000, max: 9999999 }),
                                };
                            },
                        ),
                    },
                },
            },
        });
        console.log(`Product: ${i}/${count}`);
    }
}

/**
 * Create `count` users
 */
async function populateUser(count: number) {
    for (let i = 0; i < count; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                age: faker.number.int({ min: 18, max: 100 }),
                password: faker.string.alphanumeric({ length: { min: 8, max: 20 } }),
            },
        });
        console.log(`User: ${i}/${count}`);
    }
}

/**
 * For every user create 0-50 orders
 * Each order having 0-10 orderLines
 */
async function populateOrder() {
    const variantIds = await prisma.product_variant.findMany({
        select: { id: true },
    });

    const userIds = await prisma.user.findMany({
        select: { id: true },
    });

    const userLen = userIds.length;
    const variantLen = variantIds.length;

    for (let i = 0; i < userLen; i++) {
        const orderCount = Math.floor(Math.random() * 50);
        for (let j = 0; j < orderCount; j++) {
            const linesCount = Math.floor(Math.random() * 10);
            await prisma.order.create({
                data: {
                    userId: userIds[i].id,
                    code: `ODX_${i}_${j}`,
                    total: faker.number.int({ min: 1000, max: 9999999 }),
                    totalWithTax: faker.number.int({ min: 1000, max: 9999999 }),
                    taxRate: faker.number.int({ min: 0, max: 100 }),
                    order_line: {
                        createMany: {
                            data: Array.from({ length: linesCount }).map((_) => {
                                return {
                                    quantity: Math.floor(Math.random() * 5),
                                    unitPrice: faker.number.int({ min: 1000, max: 9999999 }),
                                    productvariantId:
                                        variantIds[Math.floor(Math.random() * variantLen)].id,
                                };
                            }),
                        },
                    },
                },
            });
            console.log(`Order: ${i}/${userLen} - ${j}/${orderCount}`);
        }
    }
}

async function main() {
    await populateProduct(10000);
    await populateUser(1000);
    await populateOrder();
}

main();
