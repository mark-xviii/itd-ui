import { useParams } from 'react-router';
import { Utils } from '../../utils';
import { CharacterCreation } from '../Characters/Creation/CharacterCreation';
import { CharacterList } from '../Characters/List/CharacterList';
import { SequencesCreation } from '../Sequences/Creation/SequencesCreation';
import { SequencesList } from '../Sequences/List/SequencesList';
import { CardCreation } from '../Cards/Creation/CardCreation';
import { CardList } from '../Cards/List/CardList';
import { CardEdit } from '../Cards/Edit/CardEdit';
import { SequencesEdit } from '../Sequences/Edit/SequencesEdit';
import { CharacterEdit } from '../Characters/Edit/CharacterEdit';
import { ListUsers } from '../Users/List/ListUsers';
import { EditUsers } from '../Users/Edit/EditUsers';

export function UniversalAdminPanelNavigator() {
  let { action, entity, id } = useParams() as { action: string; entity: string; id: string };

  console.log(action, entity, id);

  if (action === Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.POST) {
    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS) {
      return <CardCreation />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS) {
      return <CharacterCreation />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES) {
      return <SequencesCreation />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS) {
      return <CardCreation />;
    }
  }

  if (action === Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.LIST) {
    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS) {
      return <CardList />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS) {
      return <CharacterList />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES) {
      return <SequencesList />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS) {
      return <ListUsers />;
    }
  }

  if (action === Utils.Constants.AVAILABLE_AP_ACTIONS_ENUM.EDIT) {
    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CARDS) {
      return <CardEdit cardToEditId={id} />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.CHARACTERS) {
      return <CharacterEdit />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.SEQUENCES) {
      return <SequencesEdit />;
    }

    if (entity === Utils.Constants.AVAILABLE_AP_ENTITIES_ENUM.USERS) {
      return <EditUsers />;
    }
  }

  return <></>;
}
