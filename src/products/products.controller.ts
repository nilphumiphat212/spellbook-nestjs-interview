import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  /*
   * TODO: Add ability to filter by name to this controller action.
   * TODO: Add ability to filter by price to this controller action. Support "greater than or equal" and "lesser than or equal".
   *
   * Example: /products?name=Something&price_subunit[gte]=10&price_subunit[lte]=100
   */


  @Get()
  index(
    @Query('name') name?: string,
    @Query('price_subunit_gte') gte?: string,
    @Query('price_subunit_lte') lte?: string
  ) {
    return this.productsService.withCondition({ name, gte, lte });
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.productsService.findOne(+id);
  }

  /*
   * TODO: Add the Category entity and create a Many-To-Many association to Products.
   * TODO: Add ability to link Products to Categories.
   */

  @Patch(':productId/categories')
  async linkProductToCategories(
    @Param('productId') productId: number,
    @Body() categoryIds: number[]
  ) {
    return this.productsService.linkProductToCategories(productId, categoryIds);
  }

  @Get('categories/:categoryId')
  async findProductsByCategory(@Param('categoryId') categoryId: number) {
    return this.productsService.findProductsByCategory(categoryId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.findOne(id);

    return this.productsService.update(product, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const product = await this.productsService.findOne(id);

    return this.productsService.remove(product);
  }
}
