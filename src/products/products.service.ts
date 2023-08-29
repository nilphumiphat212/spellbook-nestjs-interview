import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Like, Between, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

export interface ProductFilterCondition {
  name?: string;
  gte?: string | number;
  lte?: string | number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesRepository: Repository<Category>
  ) { }

  findAll() {
    return this.productsRepository.find();
  }

  findOne(id: number) {
    return this.productsRepository.findOneByOrFail({ id });
  }

  async withCondition({ name, gte, lte }: ProductFilterCondition) {
    let conditions = {};

    if (name)
      conditions = { ...conditions, name: Like(`%${name}%`) };

    if (gte && lte)
      conditions = { ...conditions, priceSubunit: Between(gte, lte) }
    else {
      if (gte)
        conditions = { ...conditions, priceSubunit: MoreThanOrEqual(gte) };
      if (lte)
        conditions = { ...conditions, priceSubunit: LessThanOrEqual(lte) };
    }

    return this.productsRepository.find({ where: conditions });
  }

  create(createProductDto: CreateProductDto) {
    return this.productsRepository.save(createProductDto);
  }

  update(product: Product, updateProductDto: UpdateProductDto) {
    return this.productsRepository.save({ ...product, ...updateProductDto });
  }

  remove(product: Product) {
    return this.productsRepository.delete(product.id);
  }

  async linkProductToCategories(productId: number, categoryIds: number[]) {
    const product = await this.productsRepository.findOneBy({ id: productId });
    const categories = await this.categoriesRepository.find({ where: { id: In(categoryIds) } });

    product.categories = categories;
    return this.productsRepository.save(product);
  }

  async findProductsByCategory(categoryId: number) {
    return this.productsRepository.createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }
}
