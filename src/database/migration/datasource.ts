import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../typeorm/typeOrm.config';

const datasource = new DataSource(dataSourceOptions);

export default datasource;
