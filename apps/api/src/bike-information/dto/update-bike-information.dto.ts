import { PartialType } from '@nestjs/swagger';
import { CreateBikeInformationDto } from './create-bike-information.dto';

export class UpdateBikeInformationDto extends PartialType(
  CreateBikeInformationDto,
) {}
