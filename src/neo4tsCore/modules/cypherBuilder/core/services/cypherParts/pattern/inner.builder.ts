import { IGraphEntity } from '../../../../../../core/entities';
import { ParamsHolder } from '../../../../../../core/entities/paramsHolder';
import { InnerPropertySetter } from '../propertyAssigner/inner.property.setter';

export type InnerGenerator = (entity: IGraphEntity) => string;

export const generateInnerFunction = (
    lineBreak: string,
    tabChar: string,
    params: ParamsHolder
): InnerGenerator => (entity: IGraphEntity) => {
    const service = new InnerPropertySetter(lineBreak, tabChar);
    const query = service.getCypher([entity], params);

    if (query) return query.slice(0, -1);
    return '';
};
